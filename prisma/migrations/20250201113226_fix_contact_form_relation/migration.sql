-- CreateTable
CREATE TABLE "contact_forms" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "trip_duration" TEXT,
    "arrival_date" DATE,
    "traveling_from" TEXT,
    "hotel_category" TEXT,
    "guests" INTEGER,
    "special_requirements" TEXT,
    "package_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_forms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contact_forms_email_key" ON "contact_forms"("email");

-- CreateIndex
CREATE INDEX "contact_form_package_id_fk" ON "contact_forms"("package_id");

-- AddForeignKey
ALTER TABLE "contact_forms" ADD CONSTRAINT "contact_forms_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
