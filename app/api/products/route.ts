import { NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const sort = searchParams.get('sort') || undefined;
    const featured = searchParams.get('featured') === 'true';

    const products = getProducts({
      category,
      search,
      sort,
      featuredOnly: featured,
    });

    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminPass = process.env.ADMIN_SECRET || 'admin123';
    if (!authHeader || authHeader !== `Bearer ${adminPass}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized administrative operation' }, { status: 401 });
    }

    const body = await request.json();
    const { name, category_id, description, price_in_paise, package_weight_grams, image_url, is_available, stock_quantity, spice_level, is_featured } = body;

    if (!name || !category_id || price_in_paise === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required product fields' }, { status: 400 });
    }

    const slug = slugify(name);
    const newProduct = createProduct({
      name,
      slug,
      category_id: category_id as 'veg' | 'non-veg',
      description: description || 'Freshly prepared traditional pickle.',
      price_in_paise: Number(price_in_paise),
      package_weight_grams: Number(package_weight_grams) || 250,
      image_url: image_url || 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
      is_available: Boolean(is_available !== false),
      stock_quantity: Number(stock_quantity) || 50,
      is_featured: Boolean(is_featured),
      spice_level: spice_level || 'Medium',
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
