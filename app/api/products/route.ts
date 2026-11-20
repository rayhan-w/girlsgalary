import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const inStock = searchParams.get('inStock') === 'true';
    const brand = searchParams.get('brand');
    const featured = searchParams.get('featured') === 'true';
    const newArrival = searchParams.get('newArrival') === 'true';
    const bestSelling = searchParams.get('bestSelling') === 'true';
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.max(1, Number(searchParams.get('limit')) || 12);

    const where: any = {
      isPublished: true
    };

    if (category) {
      where.category = { slug: category };
    }

    if (subcategory) {
      where.subCategory = { slug: subcategory };
    }

    if (brand) {
      where.brand = { slug: brand };
    }

    if (featured) {
      where.isFeatured = true;
    }

    if (newArrival) {
      where.isNewArrival = true;
    }

    if (bestSelling) {
      where.isBestSelling = true;
    }

    if (inStock) {
      where.totalStock = { gt: 0 };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.offerPrice = {};
      if (minPrice !== undefined) where.offerPrice.gte = minPrice;
      if (maxPrice !== undefined) where.offerPrice.lte = maxPrice;
    }

    if (search) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { nameBn: { contains: q } },
        { sku: { contains: q } },
        { description: { contains: q } }
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { offerPrice: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { offerPrice: 'desc' };
    } else if (sort === 'best_selling') {
      orderBy = { isBestSelling: 'desc' };
    } else if (sort === 'views') {
      orderBy = { viewCount: 'desc' };
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { name: true, nameBn: true, slug: true } },
          subCategory: { select: { name: true, slug: true } },
          brand: { select: { name: true, slug: true } },
          variants: true,
          reviews: {
            where: { status: 'APPROVED' },
            select: { rating: true }
          }
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.product.count({ where })
    ]);

    // Format products with average rating
    const formatted = products.map((p) => {
      const totalRatings = p.reviews.length;
      const avgRating = totalRatings > 0
        ? Number((p.reviews.reduce((acc, r) => acc + r.rating, 0) / totalRatings).toFixed(1))
        : 0;

      return {
        id: p.id,
        name: p.name,
        nameBn: p.nameBn,
        slug: p.slug,
        sku: p.sku,
        regularPrice: p.regularPrice,
        offerPrice: p.offerPrice,
        discountPercent: p.discountPercent || Math.round(((p.regularPrice - p.offerPrice) / p.regularPrice) * 100),
        coverImage: p.coverImage,
        category: p.category,
        subCategory: p.subCategory,
        brand: p.brand,
        totalStock: p.totalStock,
        variantsCount: p.variants.length,
        hasStock: p.totalStock > 0,
        averageRating: avgRating,
        reviewCount: totalRatings
      };
    });

    return NextResponse.json({
      products: formatted,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      nameBn,
      slug,
      sku,
      description,
      descriptionBn,
      fabric,
      careInstructions,
      regularPrice,
      offerPrice,
      coverImage,
      images,
      videoUrl,
      categoryId,
      subCategoryId,
      brandId,
      isPublished,
      isFeatured,
      isNewArrival,
      isBestSelling,
      variants
    } = body;

    const discountPercent = Math.round(((Number(regularPrice) - Number(offerPrice)) / Number(regularPrice)) * 100);

    const calculatedStock = variants?.reduce((acc: number, v: any) => acc + (Number(v.stock) || 0), 0) || 0;

    const product = await prisma.product.create({
      data: {
        name,
        nameBn,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4),
        sku: sku || 'GG-' + Math.floor(1000 + Math.random() * 9000),
        description: description || '',
        descriptionBn,
        fabric,
        careInstructions,
        regularPrice: Number(regularPrice),
        offerPrice: Number(offerPrice),
        discountPercent: isNaN(discountPercent) ? 0 : discountPercent,
        coverImage: coverImage || (images && images[0]) || '',
        images: typeof images === 'string' ? images : JSON.stringify(images || []),
        videoUrl,
        categoryId,
        subCategoryId: subCategoryId || null,
        brandId: brandId || null,
        isPublished: isPublished !== false,
        isFeatured: !!isFeatured,
        isNewArrival: !!isNewArrival,
        isBestSelling: !!isBestSelling,
        totalStock: calculatedStock,
        variants: variants?.length
          ? {
              create: variants.map((v: any) => ({
                size: v.size || 'Free Size',
                colorName: v.colorName || 'Default',
                colorHex: v.colorHex || '#000000',
                sku: v.sku,
                stock: Number(v.stock) || 0,
                priceDiff: Number(v.priceDiff) || 0,
                image: v.image || coverImage
              }))
            }
          : undefined
      },
      include: {
        variants: true
      }
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
