import { PrismaClient, LeadSource, EmailStatus, Classification, CampaignRecipientStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // 1. Seed Demo User
  const demoEmail = "demo@example.com";
  const demoPassword = "Demo@123456";
  const passwordHash = await bcrypt.hash(demoPassword, 10);

  const demoUser = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {
      passwordHash,
    },
    create: {
      email: demoEmail,
      passwordHash,
    },
  });
  console.log(`👤 Demo user ready: ${demoUser.email} (Password: ${demoPassword})`);

  // 2. Seed Leads
  const leadsData: Array<{
    buyerName?: string;
    companyName?: string;
    email: string | null;
    website?: string;
    country?: string;
    source: LeadSource;
    emailStatus: EmailStatus;
    classification: Classification | null;
  }> = [
    {
      buyerName: "Sarah Jenkins",
      companyName: "Aura Sound Healing LLC",
      email: "sarah@aurasound.com",
      website: "https://aurasound.com",
      country: "United States",
      source: LeadSource.GOOGLE,
      emailStatus: EmailStatus.VALID,
      classification: Classification.BUSINESS,
    },
    {
      buyerName: "Liam O'Connor",
      companyName: "Celtic Mindfulness Center",
      email: "liam@celticmind.ie",
      website: "https://celticmind.ie",
      country: "Ireland",
      source: LeadSource.WEBSITE,
      emailStatus: EmailStatus.VALID,
      classification: Classification.BUSINESS,
    },
    {
      buyerName: "Mei Ling",
      companyName: "Zen Resonance Studio",
      email: "meiling@zenresonance.sg",
      website: "https://zenresonance.sg",
      country: "Singapore",
      source: LeadSource.DIRECTORY,
      emailStatus: EmailStatus.VALID,
      classification: Classification.BUSINESS,
    },
    {
      buyerName: "Carlos Santana",
      companyName: null,
      email: "carlos.santana.meditation@gmail.com",
      website: null,
      country: "Spain",
      source: LeadSource.FACEBOOK,
      emailStatus: EmailStatus.VALID,
      classification: Classification.INDIVIDUAL,
    },
    {
      buyerName: "Priya Sharma",
      companyName: null,
      email: "priya.sharma.soundtherapist@outlook.com",
      website: null,
      country: "India",
      source: LeadSource.LINKEDIN,
      emailStatus: EmailStatus.VALID,
      classification: Classification.INDIVIDUAL,
    },
    {
      buyerName: "Alexander Wright",
      companyName: "Prana Vibrations",
      email: "alex@pranavibrations.co.uk",
      website: "https://pranavibrations.co.uk",
      country: "United Kingdom",
      source: LeadSource.GOOGLE,
      emailStatus: EmailStatus.VALID,
      classification: null, // Unclassified lead
    },
    {
      buyerName: "Thomas Becker",
      companyName: "Bavaria Gong & Sound",
      email: "thomas-at-bavariagong-de",
      website: null,
      country: "Germany",
      source: LeadSource.OTHER,
      emailStatus: EmailStatus.INVALID,
      classification: null,
    },
    {
      buyerName: "Maya Lin",
      companyName: null,
      email: null, // Missing email
      website: null,
      country: "Canada",
      source: LeadSource.DIRECTORY,
      emailStatus: EmailStatus.MISSING,
      classification: Classification.INDIVIDUAL,
    },
  ];

  const seededLeads: Record<string, string> = {};

  for (const lead of leadsData) {
    if (lead.email) {
      const record = await prisma.lead.upsert({
        where: { email: lead.email },
        update: {
          buyerName: lead.buyerName,
          companyName: lead.companyName,
          website: lead.website,
          country: lead.country,
          source: lead.source,
          emailStatus: lead.emailStatus,
          classification: lead.classification,
        },
        create: {
          buyerName: lead.buyerName,
          companyName: lead.companyName,
          email: lead.email,
          website: lead.website,
          country: lead.country,
          source: lead.source,
          emailStatus: lead.emailStatus,
          classification: lead.classification,
        },
      });
      seededLeads[lead.email] = record.id;
    } else {
      let record = await prisma.lead.findFirst({
        where: {
          buyerName: lead.buyerName,
          email: null,
        },
      });
      if (!record) {
        record = await prisma.lead.create({
          data: {
            buyerName: lead.buyerName,
            companyName: lead.companyName,
            email: null,
            website: lead.website,
            country: lead.country,
            source: lead.source,
            emailStatus: lead.emailStatus,
            classification: lead.classification,
          },
        });
      }
      if (lead.buyerName) {
        seededLeads[lead.buyerName] = record.id;
      }
    }
  }
  console.log(`📦 Seeded ${leadsData.length} diverse leads.`);

  // 3. Seed Campaigns
  const campaign1Name = "Himalayan Bowls B2B Sound Studios Outreach";
  let campaign1 = await prisma.campaign.findFirst({
    where: { name: campaign1Name },
  });

  if (!campaign1) {
    campaign1 = await prisma.campaign.create({
      data: {
        name: campaign1Name,
        classification: Classification.BUSINESS,
        subject: "Direct Himalayan Singing Bowls Wholesale Supply & Master Craft Catalog",
        emailMessage:
          "Dear Partner,\n\nWe are pleased to share our authentic Himalayan Singing Bowls catalog. Hand-hammered with traditional 7-metal alloys, our instruments provide unmatched acoustic quality for professional wellness and sound therapy studios.\n\nPlease find our presentation attached with wholesale specifications.\n\nWarm regards,\nExport Sales Team",
      },
    });
  }

  const campaign2Name = "Personal Sound Healing Practitioner Outreach";
  let campaign2 = await prisma.campaign.findFirst({
    where: { name: campaign2Name },
  });

  if (!campaign2) {
    campaign2 = await prisma.campaign.create({
      data: {
        name: campaign2Name,
        classification: Classification.INDIVIDUAL,
        subject: "Handcrafted Himalayan Meditation Bowls for Your Personal Practice",
        emailMessage:
          "Hello,\n\nDiscover the harmonic vibrations of genuine handcrafted Himalayan singing bowls. Tuned to individual chakra notes, our singing bowls are crafted to elevate meditation and personal healing journeys.\n\nBrowse our attached catalog to view our artisan collection.\n\nBest wishes,\nHimalayan Sound Arts",
      },
    });
  }

  console.log(`📢 Seeded campaigns: "${campaign1.name}", "${campaign2.name}"`);

  // 4. Seed Campaign Recipients for Dashboard / Reports Metrics
  // Campaign 1 (Business): 1 SENT, 1 PENDING, 1 FAILED
  const sarahId = seededLeads["sarah@aurasound.com"];
  const liamId = seededLeads["liam@celticmind.ie"];
  const meiLingId = seededLeads["meiling@zenresonance.sg"];

  if (sarahId) {
    await prisma.campaignRecipient.upsert({
      where: {
        campaignId_leadId: {
          campaignId: campaign1.id,
          leadId: sarahId,
        },
      },
      update: {},
      create: {
        campaignId: campaign1.id,
        leadId: sarahId,
        status: CampaignRecipientStatus.SENT,
        sentAt: new Date(Date.now() - 3600000),
      },
    });
  }

  if (liamId) {
    await prisma.campaignRecipient.upsert({
      where: {
        campaignId_leadId: {
          campaignId: campaign1.id,
          leadId: liamId,
        },
      },
      update: {},
      create: {
        campaignId: campaign1.id,
        leadId: liamId,
        status: CampaignRecipientStatus.PENDING,
      },
    });
  }

  if (meiLingId) {
    await prisma.campaignRecipient.upsert({
      where: {
        campaignId_leadId: {
          campaignId: campaign1.id,
          leadId: meiLingId,
        },
      },
      update: {},
      create: {
        campaignId: campaign1.id,
        leadId: meiLingId,
        status: CampaignRecipientStatus.FAILED,
        errorMessage: "SMTP 550 Mailbox unavailable or rejected connection",
      },
    });
  }

  // Campaign 2 (Individual): 1 SENT, 1 PENDING
  const carlosId = seededLeads["carlos.santana.meditation@gmail.com"];
  const priyaId = seededLeads["priya.sharma.soundtherapist@outlook.com"];

  if (carlosId) {
    await prisma.campaignRecipient.upsert({
      where: {
        campaignId_leadId: {
          campaignId: campaign2.id,
          leadId: carlosId,
        },
      },
      update: {},
      create: {
        campaignId: campaign2.id,
        leadId: carlosId,
        status: CampaignRecipientStatus.SENT,
        sentAt: new Date(Date.now() - 1800000),
      },
    });
  }

  if (priyaId) {
    await prisma.campaignRecipient.upsert({
      where: {
        campaignId_leadId: {
          campaignId: campaign2.id,
          leadId: priyaId,
        },
      },
      update: {},
      create: {
        campaignId: campaign2.id,
        leadId: priyaId,
        status: CampaignRecipientStatus.PENDING,
      },
    });
  }

  console.log("📊 Seeded campaign recipients with SENT, PENDING, and FAILED states.");
  console.log("✅ Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("❌ Seed script failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
