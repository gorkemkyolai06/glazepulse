-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('owner', 'manager', 'potter');

-- CreateEnum
CREATE TYPE "KilnType" AS ENUM ('electric', 'gas', 'raku', 'wood', 'studio');

-- CreateEnum
CREATE TYPE "KilnStatus" AS ENUM ('available', 'firing', 'cooling', 'maintenance', 'offline');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('scheduled', 'firing', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "FiringType" AS ENUM ('bisque', 'glaze', 'raku', 'stoneware', 'crystalline', 'custom');

-- CreateEnum
CREATE TYPE "MaintenancePriority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('open', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "GlazeCategory" AS ENUM ('mixing', 'testing', 'application', 'firing_prep', 'inventory', 'other');

-- CreateEnum
CREATE TYPE "GlazeStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'overdue');

-- CreateEnum
CREATE TYPE "FiringCategory" AS ENUM ('bisque_firing', 'glaze_firing', 'raku_session', 'studio_rental', 'custom_work', 'other');

-- CreateEnum
CREATE TYPE "FiringRateStatus" AS ENUM ('active', 'upcoming', 'archived');

-- CreateEnum
CREATE TYPE "ClayOrderStatus" AS ENUM ('pending', 'in_progress', 'completed', 'delivered');

-- CreateTable
CREATE TABLE "pottery_studios" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "total_kilns" INTEGER NOT NULL DEFAULT 6,
    "timezone" TEXT NOT NULL DEFAULT 'America/Chicago',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pottery_studios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'owner',
    "pottery_studio_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kilns" (
    "id" TEXT NOT NULL,
    "pottery_studio_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "kiln_type" "KilnType" NOT NULL DEFAULT 'electric',
    "kiln_model" TEXT,
    "status" "KilnStatus" NOT NULL DEFAULT 'available',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kilns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "firing_batches" (
    "id" TEXT NOT NULL,
    "pottery_studio_id" TEXT NOT NULL,
    "kiln_id" TEXT NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "firing_type" "FiringType" NOT NULL DEFAULT 'bisque',
    "cash_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "card_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "item_count" INTEGER NOT NULL DEFAULT 1,
    "cone_adjustment" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "BatchStatus" NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "firing_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kiln_maintenance" (
    "id" TEXT NOT NULL,
    "pottery_studio_id" TEXT NOT NULL,
    "kiln_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "reported_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "priority" "MaintenancePriority" NOT NULL DEFAULT 'medium',
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'open',
    "cost" DOUBLE PRECISION,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kiln_maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "glaze_checklists" (
    "id" TEXT NOT NULL,
    "pottery_studio_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "GlazeCategory" NOT NULL DEFAULT 'other',
    "zone" TEXT,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "status" "GlazeStatus" NOT NULL DEFAULT 'scheduled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "glaze_checklists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "firing_rates" (
    "id" TEXT NOT NULL,
    "pottery_studio_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "rate_category" "FiringCategory" NOT NULL DEFAULT 'bisque_firing',
    "status" "FiringRateStatus" NOT NULL DEFAULT 'active',
    "base_price" DOUBLE PRECISION NOT NULL,
    "price_multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "firing_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clay_orders" (
    "id" TEXT NOT NULL,
    "pottery_studio_id" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "clay_body" TEXT NOT NULL,
    "supplier_name" TEXT,
    "status" "ClayOrderStatus" NOT NULL DEFAULT 'pending',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clay_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "kilns_pottery_studio_id_status_idx" ON "kilns"("pottery_studio_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "kilns_pottery_studio_id_name_key" ON "kilns"("pottery_studio_id", "name");

-- CreateIndex
CREATE INDEX "firing_batches_pottery_studio_id_scheduled_at_idx" ON "firing_batches"("pottery_studio_id", "scheduled_at");

-- CreateIndex
CREATE INDEX "firing_batches_pottery_studio_id_status_idx" ON "firing_batches"("pottery_studio_id", "status");

-- CreateIndex
CREATE INDEX "kiln_maintenance_pottery_studio_id_status_idx" ON "kiln_maintenance"("pottery_studio_id", "status");

-- CreateIndex
CREATE INDEX "kiln_maintenance_pottery_studio_id_priority_idx" ON "kiln_maintenance"("pottery_studio_id", "priority");

-- CreateIndex
CREATE INDEX "glaze_checklists_pottery_studio_id_scheduled_at_idx" ON "glaze_checklists"("pottery_studio_id", "scheduled_at");

-- CreateIndex
CREATE INDEX "firing_rates_pottery_studio_id_rate_category_idx" ON "firing_rates"("pottery_studio_id", "rate_category");

-- CreateIndex
CREATE INDEX "clay_orders_pottery_studio_id_status_idx" ON "clay_orders"("pottery_studio_id", "status");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_pottery_studio_id_fkey" FOREIGN KEY ("pottery_studio_id") REFERENCES "pottery_studios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kilns" ADD CONSTRAINT "kilns_pottery_studio_id_fkey" FOREIGN KEY ("pottery_studio_id") REFERENCES "pottery_studios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "firing_batches" ADD CONSTRAINT "firing_batches_pottery_studio_id_fkey" FOREIGN KEY ("pottery_studio_id") REFERENCES "pottery_studios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "firing_batches" ADD CONSTRAINT "firing_batches_kiln_id_fkey" FOREIGN KEY ("kiln_id") REFERENCES "kilns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiln_maintenance" ADD CONSTRAINT "kiln_maintenance_pottery_studio_id_fkey" FOREIGN KEY ("pottery_studio_id") REFERENCES "pottery_studios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiln_maintenance" ADD CONSTRAINT "kiln_maintenance_kiln_id_fkey" FOREIGN KEY ("kiln_id") REFERENCES "kilns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "glaze_checklists" ADD CONSTRAINT "glaze_checklists_pottery_studio_id_fkey" FOREIGN KEY ("pottery_studio_id") REFERENCES "pottery_studios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "firing_rates" ADD CONSTRAINT "firing_rates_pottery_studio_id_fkey" FOREIGN KEY ("pottery_studio_id") REFERENCES "pottery_studios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clay_orders" ADD CONSTRAINT "clay_orders_pottery_studio_id_fkey" FOREIGN KEY ("pottery_studio_id") REFERENCES "pottery_studios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

