-- CreateTable
CREATE TABLE "athlete_events" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "sex" VARCHAR(255),
    "age" INTEGER,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "team" VARCHAR(255),
    "noc" VARCHAR(255),
    "games" VARCHAR(255),
    "year" INTEGER,
    "season" VARCHAR(255),
    "city" VARCHAR(255),
    "sport" VARCHAR(255),
    "event" VARCHAR(255),
    "medal" VARCHAR(255),

    CONSTRAINT "athlete_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "noc_regions" (
    "id" SERIAL NOT NULL,
    "noc" VARCHAR(255),
    "region" VARCHAR(255),
    "notes" VARCHAR(255),

    CONSTRAINT "noc_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "mail" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_mail_key" ON "users"("mail");
