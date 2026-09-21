// scripts/clear-db.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🗑️ Clearing database...");

    // 1. Delete children / join tables first
    await prisma.campaignRecipient.deleteMany();

    // 2. Delete main entity tables with foreign keys or independent data
    await prisma.campaign.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.settings.deleteMany();
    await prisma.user.deleteMany();

    console.log("✅ Database completely cleared.");
}

main()
    .catch((error) => {
        console.error("❌ Failed to clear database:");
        console.error(error);
    })
    .finally(async () => {
        await prisma.$disconnect();
});