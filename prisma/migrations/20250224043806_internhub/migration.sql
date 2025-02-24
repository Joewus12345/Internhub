-- CreateTable
CREATE TABLE `Student` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `contact_number` VARCHAR(191) NOT NULL,
    `reference_number` VARCHAR(191) NOT NULL,
    `programme` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `progress` VARCHAR(191) NOT NULL DEFAULT 'first',
    `profile_url` VARCHAR(191) NULL,
    `profile_key` VARCHAR(191) NULL,
    `otp` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL,

    UNIQUE INDEX `Student_id_key`(`id`),
    UNIQUE INDEX `Student_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Application` (
    `id` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NULL,
    `applicantId` VARCHAR(191) NOT NULL,
    `internshipId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `applicationStatus` VARCHAR(191) NULL,
    `accept` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Application_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Internship` (
    `id` VARCHAR(191) NOT NULL,
    `posted_by` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `title` VARCHAR(191) NOT NULL,
    `requirements` VARCHAR(191) NULL,
    `description` VARCHAR(191) NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `expected_applicants` VARCHAR(191) NULL,
    `programme` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NULL,
    `soft_delete` BOOLEAN NOT NULL DEFAULT false,
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,

    UNIQUE INDEX `Internship_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CompanyRepresentative` (
    `representative_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `contact_number` VARCHAR(191) NOT NULL,
    `company_id` INTEGER NOT NULL,
    `profile_url` VARCHAR(191) NULL,
    `profile_key` VARCHAR(191) NULL,
    `ishiringmanager` VARCHAR(191) NULL,
    `isActive` BOOLEAN NULL,
    `otp` VARCHAR(191) NULL,

    UNIQUE INDEX `CompanyRepresentative_email_key`(`email`),
    UNIQUE INDEX `CompanyRepresentative_company_id_key`(`company_id`),
    INDEX `representative_company_idx`(`company_id`),
    PRIMARY KEY (`representative_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Company` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `rating` INTEGER NULL,
    `profile_url` VARCHAR(191) NULL,
    `profile_key` VARCHAR(191) NULL,
    `headcount` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_applicantId_fkey` FOREIGN KEY (`applicantId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_internshipId_fkey` FOREIGN KEY (`internshipId`) REFERENCES `Internship`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Internship` ADD CONSTRAINT `Internship_posted_by_fkey` FOREIGN KEY (`posted_by`) REFERENCES `CompanyRepresentative`(`representative_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyRepresentative` ADD CONSTRAINT `CompanyRepresentative_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
