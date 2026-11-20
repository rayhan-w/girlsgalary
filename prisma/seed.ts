import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../app/generated/prisma/client.js';
import bcrypt from 'bcryptjs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log('🌱 Starting Girlsgalary database seed...');

  // 1. Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      shopName: 'Girlsgalary',
      logo: '/images/logo.png',
      hotline: '01307-214246',
      whatsappNumber: '8801307214246',
      topBarOffer: '🎉 ফ্রি ডেলিভারি সারা বাংলাদেশে ২,০০০ টাকার বেশি অর্ডারে! (Free Delivery nationwide over ৳2,000)',
      address: 'সৈয়দপুর, নীলফামারী, বাংলাদেশ',
      email: 'order@girlsgalary.com',
      facebookUrl: 'https://facebook.com/girlsgalary',
      bkashNumber: '01307214246',
      nagadNumber: '01307214246',
      bkashInstructions: 'বিকাশ পার্সোনাল নম্বরে Send Money করুন। এরপর নিচে আপনার প্রেরক নম্বর ও TrxID প্রদান করুন।',
      nagadInstructions: 'নগদ পার্সোনাল নম্বরে Send Money করুন। এরপর নিচে আপনার প্রেরক নম্বর ও TrxID প্রদান করুন।',
      isCodEnabled: true,
      deliveryChargeInsideDhaka: 70,
      deliveryChargeNearDhaka: 100,
      deliveryChargeOutsideDhaka: 130,
      freeDeliveryThreshold: 2000,
      deliveryTimeInsideDhaka: '২৪-৪৮ ঘণ্টার মধ্যে',
      deliveryTimeOutsideDhaka: '২-৪ দিনের মধ্যে',
      trustStripCod: 'ক্যাশ অন ডেলিভারি (সারা দেশে পণ্য হাতে পেয়ে মূল্য পরিশোধ)',
      trustStripDelivery: 'সারা বাংলাদেশে দ্রুত হোম ডেলিভারি সুবিধা',
      trustStripExchange: 'সহজ ও নিশ্চিত ৩ দিনের এক্সচেঞ্জ পলিসি',
      footerAbout: 'Girlsgalary হচ্ছে নারীদের আভিজাত্য ও আধুনিক ফ্যাশনের নির্ভরযোগ্য প্রতিষ্ঠান। প্রিমিয়াম শাড়ি, থ্রি-পিস, কুর্তি, জুয়েলারি ও কসমেটিকস এখন ঘরে বসেই অর্ডার করুন।',
      footerCopyright: '© 2026 Girlsgalary. All rights reserved.',
      isPixelEnabled: true,
      metaPixelId: '123456789012345',
      metaCapiToken: 'EAAXsampleServerCapiTokenMaskedSecurely',
      isGtmEnabled: true,
      gtmId: 'GTM-GG0001',
      isGa4Enabled: true,
      ga4Id: 'G-GG12345678'
    }
  });

  // 2. Staff Users (Owner, Manager, Staff)
  const hashedOwnerPassword = await bcrypt.hash('admin123', 10);
  const hashedManagerPassword = await bcrypt.hash('manager123', 10);
  const hashedStaffPassword = await bcrypt.hash('staff123', 10);

  await prisma.staffUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      name: 'Girlsgalary Owner',
      username: 'admin',
      password: hashedOwnerPassword,
      role: 'OWNER'
    }
  });

  await prisma.staffUser.upsert({
    where: { username: 'manager' },
    update: {},
    create: {
      name: 'Operations Manager',
      username: 'manager',
      password: hashedManagerPassword,
      role: 'MANAGER'
    }
  });

  await prisma.staffUser.upsert({
    where: { username: 'staff' },
    update: {},
    create: {
      name: 'Order Processing Staff',
      username: 'staff',
      password: hashedStaffPassword,
      role: 'STAFF'
    }
  });

  // 3. Categories with Subcategories & Size Charts
  const categoriesData = [
    {
      name: 'Saree',
      nameBn: 'শাড়ি',
      slug: 'saree',
      order: 1,
      photo: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
      sizeChartData: JSON.stringify([
        { size: 'Standard Length', length: '12 Haath (5.5m)', blouse: '80cm unstitched included', width: '45 inches' }
      ]),
      subCategories: ['Jamdani', 'Georgette', 'Cotton', 'Silk', 'Katan', 'Organza']
    },
    {
      name: 'Three Piece',
      nameBn: 'থ্রি পিস',
      slug: 'three-piece',
      order: 2,
      photo: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80',
      sizeChartData: JSON.stringify([
        { size: 'S', bust: '36"', length: '40"', waist: '32"', hip: '38"' },
        { size: 'M', bust: '38"', length: '42"', waist: '34"', hip: '40"' },
        { size: 'L', bust: '40"', length: '44"', waist: '36"', hip: '42"' },
        { size: 'XL', bust: '42"', length: '46"', waist: '38"', hip: '44"' },
        { size: 'XXL', bust: '44"', length: '46"', waist: '40"', hip: '46"' }
      ]),
      subCategories: ['Lawn', 'Cotton', 'Georgette', 'Party Wear', 'Embroidered']
    },
    {
      name: 'Kurti',
      nameBn: 'কুর্তি',
      slug: 'kurti',
      order: 3,
      photo: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1600&q=80',
      sizeChartData: JSON.stringify([
        { size: '36', bust: '36"', length: '42"', shoulder: '14.5"' },
        { size: '38', bust: '38"', length: '43"', shoulder: '15.0"' },
        { size: '40', bust: '40"', length: '44"', shoulder: '15.5"' },
        { size: '42', bust: '42"', length: '45"', shoulder: '16.0"' },
        { size: '44', bust: '44"', length: '45"', shoulder: '16.5"' }
      ]),
      subCategories: ['Single Kurti', 'Long Kurti', 'Short Kurti', 'Kaftan', 'Tops']
    },
    {
      name: 'Cosmetics',
      nameBn: 'কসমেটিকস',
      slug: 'cosmetics',
      order: 4,
      photo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80',
      subCategories: ['Lipstick', 'Foundation', 'Eye Makeup', 'Skin Care', 'Perfume & Mist']
    },
    {
      name: 'Jewellery',
      nameBn: 'জুয়েলারি',
      slug: 'jewellery',
      order: 5,
      photo: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=80',
      subCategories: ['Necklace Set', 'Earrings', 'Bangles', 'Payel', 'Rings']
    },
    {
      name: 'Bag',
      nameBn: 'ব্যাগ',
      slug: 'bag',
      order: 6,
      photo: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1600&q=80',
      subCategories: ['Handbag', 'Shoulder Bag', 'Party Clutch', 'Tote Bag', 'Backpack']
    },
    {
      name: 'Shoes',
      nameBn: 'জুতা',
      slug: 'shoes',
      order: 7,
      photo: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1600&q=80',
      sizeChartData: JSON.stringify([
        { size: '36', eu: '36', uk: '3.5', inInches: '9.0"' },
        { size: '37', eu: '37', uk: '4.0', inInches: '9.2"' },
        { size: '38', eu: '38', uk: '5.0', inInches: '9.5"' },
        { size: '39', eu: '39', uk: '6.0', inInches: '9.8"' },
        { size: '40', eu: '40', uk: '6.5', inInches: '10.0"' }
      ]),
      subCategories: ['Flat Sandals', 'Block Heels', 'Party Nagra', 'Wedges', 'Slippers']
    },
    {
      name: 'Hijab',
      nameBn: 'হিজাব',
      slug: 'hijab',
      order: 8,
      photo: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1600&q=80',
      sizeChartData: JSON.stringify([
        { size: 'Standard', length: '75 inches', width: '32 inches', material: 'Premium Georgette / Modal' },
        { size: 'Maxi Khimar', length: '85 inches', width: '40 inches', material: 'Chiffon / Nida' }
      ]),
      subCategories: ['Premium Georgette', 'Cotton Voile', 'Jersey Hijab', 'Instant Hijab', 'Khimar', 'Hijab Caps & Pins']
    }
  ];

  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        nameBn: cat.nameBn,
        order: cat.order,
        photo: cat.photo,
        banner: cat.banner,
        sizeChartData: cat.sizeChartData ?? null
      },
      create: {
        name: cat.name,
        nameBn: cat.nameBn,
        slug: cat.slug,
        order: cat.order,
        photo: cat.photo,
        banner: cat.banner,
        sizeChartData: cat.sizeChartData ?? null
      }
    });

    for (let i = 0; i < cat.subCategories.length; i++) {
      const subName = cat.subCategories[i];
      const subSlug = `${cat.slug}-${subName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      await prisma.subCategory.upsert({
        where: { slug: subSlug },
        update: { name: subName, order: i + 1 },
        create: {
          categoryId: createdCat.id,
          name: subName,
          slug: subSlug,
          order: i + 1
        }
      });
    }
  }

  // 4. Brands for Cosmetics
  const brands = [
    { name: 'MAC', slug: 'mac' },
    { name: 'Maybelline New York', slug: 'maybelline' },
    { name: "L'Oreal Paris", slug: 'loreal' },
    { name: 'Focallure', slug: 'focallure' },
    { name: 'The Body Shop', slug: 'the-body-shop' }
  ];

  for (const b of brands) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name },
      create: { name: b.name, slug: b.slug }
    });
  }

  // 5. Hero Banners
  await prisma.banner.deleteMany({});
  await prisma.banner.createMany({
    data: [
      {
        title: 'এক্সক্লুসিভ কালেকশন ২০২৬',
        subtitle: 'প্রিমিয়াম জামদানি, সিল্ক শাড়ি ও ডিজাইনার কুর্তি',
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
        mobileImageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        linkUrl: '/category/saree',
        buttonText: 'অর্ডার করুন এখনই',
        order: 1
      },
      {
        title: 'নিউ অ্যারাইভাল থ্রি পিস',
        subtitle: 'আরামদায়ক পিওর সুতি ও লন থ্রি পিস কালেকশন',
        imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80',
        mobileImageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        linkUrl: '/category/three-piece',
        buttonText: 'কালেকশন দেখুন',
        order: 2
      },
      {
        title: 'শতভাগ অথেনটিক কসমেটিকস ও জুয়েলারি',
        subtitle: 'সেরা ব্র্যান্ডের আসল লিপস্টিক, স্কিন কেয়ার ও কুন্দন সেট',
        imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80',
        mobileImageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
        linkUrl: '/category/cosmetics',
        buttonText: 'শপ করুন',
        order: 3
      }
    ]
  });

  // 6. Content Pages
  const pages = [
    {
      slug: 'about-us',
      title: 'About Us | আমাদের সম্পর্কে',
      content: 'Girlsgalary হলো বাংলাদেশের অন্যতম বিশ্বস্ত নারী ফ্যাশন ও লাইফস্টাইল ই-কমার্স প্ল্যাটফর্ম। আমাদের মূল লক্ষ্য সুলভ মূল্যে প্রিমিয়াম কোয়ালিটির শাড়ি, থ্রি-পিস, কুর্তি, কসমেটিকস, জুয়েলারি ও হিজাব গ্রাহকের দোরগোড়ায় পৌঁছে দেওয়া।'
    },
    {
      slug: 'delivery-policy',
      title: 'Delivery Policy | ডেলিভারি পলিসি',
      content: 'আমরা সমগ্র বাংলাদেশে দ্রুততম সময়ে হোম ডেলিভারি নিশ্চিত করি। ঢাকা সিটির ভেতরে ডেলিভারি চার্জ ৭০ টাকা (২৪-৪৮ ঘণ্টার মধ্যে ডেলিভারি)। ঢাকা সাব-এরিয়া বা পার্শ্ববর্তী এলাকায় ১০০ টাকা। ঢাকার বাইরে সারা বাংলাদেশে ১৩০ টাকা (২-৪ দিনের মধ্যে ডেলিভারি)। ২,০০০ টাকার বেশি অর্ডারে সারা দেশে ডেলিভারি সম্পূর্ণ ফ্রি।'
    },
    {
      slug: 'return-policy',
      title: 'Return & Exchange Policy | রিটার্ন ও এক্সচেঞ্জ',
      content: 'পণ্য হাতে পেয়ে যদি কোনো ডিফেক্ট, সাইজ বা কালার সংক্রান্ত সমস্যা পরিলক্ষিত হয়, তবে ডেলিভারি পাওয়ার ৩ দিনের মধ্যে আমাদের হটলাইন বা হোয়াটসঅ্যাপে যোগাযোগ করে খুব সহজেই এক্সচেঞ্জ করে নিতে পারবেন।'
    },
    {
      slug: 'privacy-policy',
      title: 'Privacy Policy | গোপনীয়তা নীতি',
      content: 'গ্রাহকের তথ্যের গোপনীয়তা রক্ষা করা আমাদের দায়িত্ব। আপনার নাম, মোবাইল নম্বর এবং ঠিকানা শুধুমাত্র পার্সেল ডেলিভারি ও অর্ডার ট্র্যাকিংয়ের উদ্দেশ্যে ব্যবহৃত হবে।'
    },
    {
      slug: 'terms',
      title: 'Terms & Conditions | শর্তাবলী',
      content: 'Girlsgalary থেকে অর্ডার করার মাধ্যমে আপনি আমাদের শর্তাবলীর সাথে সম্মত হচ্ছেন। অর্ডার কনফার্মেশনের পর আমাদের টিম দ্রুত পার্সেল প্রসেস করে নির্ধারিত কুরিয়ারে হস্তান্তর করবে।'
    },
    {
      slug: 'faq',
      title: 'FAQ | সাধারণ প্রশ্নাবলী',
      content: '১. ক্যাশ অন ডেলিভারি কি সারা দেশে আছে? হ্যাঁ, সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা রয়েছে।\n২. অগ্রিম টাকা দেওয়া কি বাধ্যতামূলক? না, ক্যাশ অন ডেলিভারিতে কোনো অগ্রিম চার্জ ছাড়া অর্ডার করা যায়। চাইলে বিকাশ বা নগদে অগ্রিম পরিশোধ করা যাবে।\n৩. সাইজ সমস্যা হলে কি এক্সচেঞ্জ করা যাবে? হ্যাঁ, ৩ দিনের মধ্যে এক্সচেঞ্জ করা যাবে।'
    }
  ];

  for (const page of pages) {
    await prisma.contentPage.upsert({
      where: { slug: page.slug },
      update: page,
      create: page
    });
  }

  // 7. Seed Sample Products with Real Colors & Sizes
  const sareeCat = await prisma.category.findUnique({ where: { slug: 'saree' } });
  const threePieceCat = await prisma.category.findUnique({ where: { slug: 'three-piece' } });
  const kurtiCat = await prisma.category.findUnique({ where: { slug: 'kurti' } });
  const cosmeticsCat = await prisma.category.findUnique({ where: { slug: 'cosmetics' } });
  const jewelleryCat = await prisma.category.findUnique({ where: { slug: 'jewellery' } });
  const bagCat = await prisma.category.findUnique({ where: { slug: 'bag' } });
  const shoesCat = await prisma.category.findUnique({ where: { slug: 'shoes' } });
  const hijabCat = await prisma.category.findUnique({ where: { slug: 'hijab' } });

  const sareeSub = await prisma.subCategory.findFirst({ where: { categoryId: sareeCat!.id } });
  const tpSub = await prisma.subCategory.findFirst({ where: { categoryId: threePieceCat!.id } });
  const kurtiSub = await prisma.subCategory.findFirst({ where: { categoryId: kurtiCat!.id } });
  const macBrand = await prisma.brand.findFirst({ where: { slug: 'mac' } });

  // Product 1: Dhakai Jamdani Saree
  const prod1 = await prisma.product.upsert({
    where: { slug: 'traditional-dhakai-jamdani-saree' },
    update: {},
    create: {
      name: 'Royal Heritage Dhakai Jamdani Saree',
      nameBn: 'রয়েল হেরিটেজ ঐতিহ্যবাহী জামদানি শাড়ি',
      slug: 'traditional-dhakai-jamdani-saree',
      sku: 'GG-SAR-001',
      description: 'Handcrafted luxury Dhakai Jamdani saree woven with ultra-fine cotton-silk thread. Comes with matching unstitched blouse piece.',
      descriptionBn: 'শতভাগ খাঁটি সুতি ও রেশম সুতার নিখুঁত বুননে তৈরি ঐতিহ্যবাহী ঢাকাই জামদানি শাড়ি। আভিজাত্য ও ঐতিহ্যের সেরা সংমিশ্রণ।',
      fabric: 'Fine Cotton Silk (৮৪ কাউন্ট)',
      careInstructions: 'Dry Clean Only. আয়রন করার সময় কম তাপে রাখুন।',
      regularPrice: 4200,
      offerPrice: 3450,
      discountPercent: 18,
      coverImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
      ]),
      categoryId: sareeCat!.id,
      subCategoryId: sareeSub?.id,
      isFeatured: true,
      isNewArrival: true,
      isBestSelling: true,
      totalStock: 35
    }
  });

  // Variants for Product 1 (Maroon, Bottle Green, Pastel Gold)
  await prisma.productVariant.createMany({
    data: [
      {
        productId: prod1.id,
        size: 'Free Size',
        colorName: 'Maroon',
        colorHex: '#800000',
        sku: 'GG-SAR-001-MRN',
        stock: 12,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
      },
      {
        productId: prod1.id,
        size: 'Free Size',
        colorName: 'Bottle Green',
        colorHex: '#006A4E',
        sku: 'GG-SAR-001-BGN',
        stock: 15,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
      },
      {
        productId: prod1.id,
        size: 'Free Size',
        colorName: 'Baby Pink',
        colorHex: '#F4C2C2',
        sku: 'GG-SAR-001-BPK',
        stock: 8,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
      }
    ]
  });

  // Product 2: Embroidered Three Piece
  const prod2 = await prisma.product.upsert({
    where: { slug: 'luxury-embroidered-lawn-three-piece' },
    update: {},
    create: {
      name: 'Luxury Embroidered Lawn Three Piece Suit',
      nameBn: 'লাক্সারি এমব্রয়ডারি লন থ্রি পিস',
      slug: 'luxury-embroidered-lawn-three-piece',
      sku: 'GG-3PC-002',
      description: 'Heavy computerized embroidery work on front neckline and daman. Pure cotton digital print dupatta and comfortable trouser.',
      descriptionBn: 'বুকের ওপর আকর্ষণীয় কম্পিউটার এমব্রয়ডারি করা প্রিমিয়াম লন কামিজ, সাথে ডিজিটাল প্রিন্ট পিওর ওড়না ও আরামদায়ক ট্রাউজার।',
      fabric: 'Swiss Lawn & Pure Cotton Dupatta',
      careInstructions: 'হালকা ডিটারজেন্ট দিয়ে নরমাল ওয়াশ করুন।',
      regularPrice: 2850,
      offerPrice: 2250,
      discountPercent: 21,
      coverImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
      ]),
      categoryId: threePieceCat!.id,
      subCategoryId: tpSub?.id,
      isFeatured: true,
      isNewArrival: true,
      isBestSelling: true,
      totalStock: 50
    }
  });

  await prisma.productVariant.createMany({
    data: [
      { productId: prod2.id, size: 'M (38)', colorName: 'Sky Blue', colorHex: '#87CEEB', stock: 15 },
      { productId: prod2.id, size: 'L (40)', colorName: 'Sky Blue', colorHex: '#87CEEB', stock: 20 },
      { productId: prod2.id, size: 'XL (42)', colorName: 'Sky Blue', colorHex: '#87CEEB', stock: 5 },
      { productId: prod2.id, size: 'M (38)', colorName: 'Mustard Yellow', colorHex: '#FFDB58', stock: 10 }
    ]
  });

  // Product 3: Designer Kurti
  const prod3 = await prisma.product.upsert({
    where: { slug: 'chic-designer-flair-kurti' },
    update: {},
    create: {
      name: 'Chic Designer Long Flair Kurti',
      nameBn: 'চিক ডিজাইনার লং ফ্লেয়ার কুর্তি',
      slug: 'chic-designer-flair-kurti',
      sku: 'GG-KRT-003',
      description: 'Elegant casual and office-wear kurti tailored from soft breathable viscose rayon fabric.',
      descriptionBn: 'দৈনন্দিন ব্যবহার ও অফিসের জন্য মানানসই স্টাইলিশ লং ফ্লেয়ার কুর্তি। আরামদায়ক ও ট্রেন্ডি।',
      fabric: 'Rayon Cotton Blend',
      careInstructions: 'Machine washable, wash inside out.',
      regularPrice: 1650,
      offerPrice: 1250,
      discountPercent: 24,
      coverImage: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80'
      ]),
      categoryId: kurtiCat!.id,
      subCategoryId: kurtiSub?.id,
      isFeatured: true,
      isNewArrival: true,
      totalStock: 40
    }
  });

  await prisma.productVariant.createMany({
    data: [
      { productId: prod3.id, size: '38', colorName: 'Wine Red', colorHex: '#722F37', stock: 12 },
      { productId: prod3.id, size: '40', colorName: 'Wine Red', colorHex: '#722F37', stock: 14 },
      { productId: prod3.id, size: '42', colorName: 'Wine Red', colorHex: '#722F37', stock: 0 }, // Out of stock size to test Page 12 checklist
      { productId: prod3.id, size: '38', colorName: 'Olive Green', colorHex: '#556B2F', stock: 14 }
    ]
  });

  // Product 4: Cosmetics (MAC Retro Matte Lipstick)
  const prod4 = await prisma.product.upsert({
    where: { slug: 'mac-retro-matte-lipstick-ruby-woo' },
    update: {},
    create: {
      name: 'MAC Retro Matte Lipstick - Ruby Woo',
      nameBn: 'ম্যাক রেট্রো ম্যাট লিপস্টিক (রুবি উ)',
      slug: 'mac-retro-matte-lipstick-ruby-woo',
      sku: 'GG-COS-004',
      description: '100% authentic long-wearing formula features an intense color payoff and a completely matte finish.',
      descriptionBn: '১০০% অরিজিনাল লং-লাস্টিং ম্যাট ফিনিশ লিপস্টিক। ঠোঁটে দেয় ডিপ ও উজ্জ্বল আকর্ষণীয় লুক।',
      fabric: '3g Net Weight | Shade: Vivid Blue-Red',
      regularPrice: 2600,
      offerPrice: 2200,
      discountPercent: 15,
      coverImage: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80'
      ]),
      categoryId: cosmeticsCat!.id,
      brandId: macBrand?.id,
      isFeatured: true,
      isBestSelling: true,
      totalStock: 25
    }
  });

  await prisma.productVariant.createMany({
    data: [
      { productId: prod4.id, size: 'Standard (3g)', colorName: 'Ruby Woo (Red)', colorHex: '#B22222', stock: 15 },
      { productId: prod4.id, size: 'Standard (3g)', colorName: 'Velvet Teddy (Nude)', colorHex: '#C08A77', stock: 10 }
    ]
  });

  // Product 5: Kundan Jewellery Set
  const prod5 = await prisma.product.upsert({
    where: { slug: 'regal-kundan-bridal-necklace-set' },
    update: {},
    create: {
      name: 'Regal Gold Plated Kundan Choker Necklace Set',
      nameBn: 'রিগাল গোল্ড প্লেটেড কুন্দন চোখার নেকলেস সেট',
      slug: 'regal-kundan-bridal-necklace-set',
      sku: 'GG-JWL-005',
      description: 'Exquisite bridal party choker necklace with matching heavy jhumka earrings and maang tikka.',
      descriptionBn: 'আভিজাত্যপূর্ণ কুন্দন কারুকার্যে তৈরি চোখার সেট সাথে গর্জিয়াস ঝুমকা ও টিকলি।',
      regularPrice: 2400,
      offerPrice: 1850,
      discountPercent: 23,
      coverImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
      ]),
      categoryId: jewelleryCat!.id,
      isFeatured: true,
      totalStock: 20
    }
  });

  await prisma.productVariant.createMany({
    data: [
      { productId: prod5.id, size: 'Free Size', colorName: 'Golden Green Kundan', colorHex: '#DAA520', stock: 12 },
      { productId: prod5.id, size: 'Free Size', colorName: 'Ruby Red Kundan', colorHex: '#9B111E', stock: 8 }
    ]
  });

  // Product 6: Premium Georgette Hijab
  const prod6 = await prisma.product.upsert({
    where: { slug: 'premium-heavy-georgette-hijab' },
    update: {},
    create: {
      name: 'Premium Breathable Heavy Georgette Hijab',
      nameBn: 'প্রিমিয়াম হেভি জর্জেট হিজাব',
      slug: 'premium-heavy-georgette-hijab',
      sku: 'GG-HJB-006',
      description: 'Non-slip, opaque, high quality heavy georgette hijab. Easy to drape and maintains shape all day.',
      descriptionBn: 'নন-স্লিপ, আরামদায়ক প্রিমিয়াম হেভি জর্জেট হিজাব। চমৎকার ফল এবং সহজে পরিধানযোগ্য।',
      fabric: 'Heavy Dubai Georgette (75x32 inches)',
      regularPrice: 650,
      offerPrice: 480,
      discountPercent: 26,
      coverImage: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80'
      ]),
      categoryId: hijabCat!.id,
      isFeatured: true,
      isNewArrival: true,
      totalStock: 60
    }
  });

  await prisma.productVariant.createMany({
    data: [
      { productId: prod6.id, size: '75x32"', colorName: 'Nude Beige', colorHex: '#F5F5DC', stock: 20 },
      { productId: prod6.id, size: '75x32"', colorName: 'Dark Plum', colorHex: '#4A0E2E', stock: 20 },
      { productId: prod6.id, size: '75x32"', colorName: 'Deep Teal', colorHex: '#008080', stock: 20 }
    ]
  });

  // 8. Sample Reviews
  await prisma.review.create({
    data: {
      productId: prod1.id,
      customerName: 'নুসরাত জাহান',
      rating: 5,
      comment: 'শাড়ির কোয়ালিটি ছবির চেয়েও অনেক বেশি সুন্দর! ডেলিভারিও পেয়েছি মাত্র ২ দিনে। ধন্যবাদ গার্লসগ্যালারি!',
      status: 'APPROVED'
    }
  });

  await prisma.review.create({
    data: {
      productId: prod2.id,
      customerName: 'Samia Afrin',
      rating: 5,
      comment: 'Super fast delivery. Fabric is very soft and comfortable for daily wear.',
      status: 'APPROVED'
    }
  });

  // 9. Initial Coupons
  await prisma.coupon.upsert({
    where: { code: 'GIRLS10' },
    update: {},
    create: {
      code: 'GIRLS10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderAmount: 1500,
      isActive: true
    }
  });

  await prisma.coupon.upsert({
    where: { code: 'EID200' },
    update: {},
    create: {
      code: 'EID200',
      discountType: 'FIXED',
      discountValue: 200,
      minOrderAmount: 2000,
      isActive: true
    }
  });

  console.log('✅ Girlsgalary database seeded successfully!');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
