import { prisma } from '../lib/prisma';

async function updateSettings() {
  const current = await prisma.siteSettings.findFirst();
  console.log("Current settings:", current);

  const updated = await prisma.siteSettings.updateMany({
    data: {
      hotline: '01307-214246',
      whatsappNumber: '8801307214246',
      bkashNumber: '01307214246',
      nagadNumber: '01307214246',
      address: 'সৈয়দপুর, নীলফামারী, বাংলাদেশ',
      deliveryTimeInsideDhaka: '২৪-৪৮ ঘণ্টার মধ্যে (সৈয়দপুর ও আশপাশ)',
      deliveryTimeOutsideDhaka: '২-৪ দিনের মধ্যে (সৈয়দপুরের বাইরে)'
    }
  });

  console.log("Updated settings count:", updated);
  const now = await prisma.siteSettings.findFirst();
  console.log("New settings in DB:", now);
}

updateSettings().catch(console.error).finally(() => process.exit(0));
