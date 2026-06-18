import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new UnauthorizedException('Bu e-posta adresi zaten kayıtlı');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const potteryStudio = await this.prisma.potteryStudio.create({
      data: {
        name: dto.potteryStudioName,
        phone: dto.phone,
        city: dto.city,
        state: dto.state,
        users: {
          create: {
            email: dto.email,
            passwordHash,
            firstName: dto.firstName,
            lastName: dto.lastName,
            role: 'owner',
          },
        },
      },
      include: { users: true },
    });

    const user = potteryStudio.users[0];
    const token = this.generateToken(user.id, user.email, potteryStudio.id);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      potteryStudio: {
        id: potteryStudio.id,
        name: potteryStudio.name,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { potteryStudio: true },
    });

    if (!user) {
      throw new UnauthorizedException('Geçersiz giriş bilgileri');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Geçersiz giriş bilgileri');
    }

    const token = this.generateToken(user.id, user.email, user.potteryStudioId);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      potteryStudio: {
        id: user.potteryStudio.id,
        name: user.potteryStudio.name,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { potteryStudio: true },
    });

    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      potteryStudio: {
        id: user.potteryStudio.id,
        name: user.potteryStudio.name,
        phone: user.potteryStudio.phone,
        city: user.potteryStudio.city,
        state: user.potteryStudio.state,
        totalKilns: user.potteryStudio.totalKilns,
      },
    };
  }

  private generateToken(userId: string, email: string, potteryStudioId: string): string {
    return this.jwtService.sign({ sub: userId, email, potteryStudioId });
  }
}
