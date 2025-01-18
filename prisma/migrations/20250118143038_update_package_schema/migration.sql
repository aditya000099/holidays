-- AlterTable
ALTER TABLE "packages" ADD COLUMN     "days" INTEGER,
ADD COLUMN     "exclusions" TEXT[],
ADD COLUMN     "highlights" TEXT[],
ADD COLUMN     "inclusions" TEXT[],
ADD COLUMN     "nights" INTEGER;

-- CreateTable
CREATE TABLE "package_itineraries" (
    "id" SERIAL NOT NULL,
    "package_id" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "package_itineraries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "package_itinerary_package_id_fk" ON "package_itineraries"("package_id");

-- AddForeignKey
ALTER TABLE "package_itineraries" ADD CONSTRAINT "package_itineraries_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
