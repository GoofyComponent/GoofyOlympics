/*
  Warnings:

  - A unique constraint covering the columns `[noc,region]` on the table `noc_regions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "noc_regions_noc_region_key" ON "noc_regions"("noc", "region");
