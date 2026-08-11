import { NextResponse } from "next/server";
import {
  getProducts,
  createProduct,
} from "@/lib/products-db";
import { uploadToCloudinary } from "@/lib/cloudinary";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods":
    "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

/**
 * GET /api/products
 *
 * Optional:
 * /api/products?categoryId=xxx
 */
export async function GET(request: Request) {
  const startTime = performance.now();

  try {
    const { searchParams } = new URL(request.url);

    const categoryId =
      searchParams.get("categoryId") || undefined;

    console.log(
      `[PRODUCTS] Fetching products${categoryId
        ? ` for category ${categoryId}`
        : ""
      }`
    );

    const dbStart = performance.now();

    const products = await getProducts(categoryId);

    const dbTime = performance.now() - dbStart;
    const totalTime = performance.now() - startTime;

    console.log(
      `[PRODUCTS] DB: ${dbTime.toFixed(0)}ms | TOTAL: ${totalTime.toFixed(0)}ms | COUNT: ${products.length}`
    );

    return NextResponse.json(
      {
        success: true,
        data: products,
      },
      {
        headers: {
          ...corsHeaders,

          // Cache response for 60 seconds
          "Cache-Control":
            "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error: unknown) {
    console.error(
      "[PRODUCTS GET ERROR]",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch products.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

/**
 * POST /api/products
 *
 * Creates a product and optionally uploads
 * the product image to Cloudinary.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name =
      formData.get("name") as string;

    const categoryId =
      formData.get("categoryId") as string;

    const categoryName =
      formData.get("categoryName") as string;

    const description =
      (formData.get("description") as string) || "";

    const badge =
      (formData.get("badge") as string) || null;

    const rating =
      parseFloat(
        formData.get("rating") as string
      ) || 4.5;

    const color =
      (formData.get("color") as string) ||
      "#60A5FA";

    const tags = JSON.parse(
      (formData.get("tags") as string) || "[]"
    );

    const visible =
      formData.get("visible") !== "false";

    const file =
      formData.get("image") as File | null;

    let imageUrl =
      (formData.get("imageUrl") as string) || "";

    // Validate required fields
    if (
      !name ||
      !categoryId ||
      !categoryName
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "name, categoryId, and categoryName are required.",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Upload image to Cloudinary
    if (file && file.size > 0) {
      try {
        const bytes =
          await file.arrayBuffer();

        const buffer =
          Buffer.from(bytes);

        imageUrl =
          await uploadToCloudinary(
            buffer,
            categoryName
          );
      } catch (uploadError: unknown) {
        console.error(
          "[CLOUDINARY UPLOAD ERROR]",
          uploadError
        );

        const message =
          uploadError instanceof Error
            ? uploadError.message
            : "Unknown Cloudinary error";

        return NextResponse.json(
          {
            success: false,
            error: `Cloudinary upload failed: ${message}`,
          },
          {
            status: 500,
            headers: corsHeaders,
          }
        );
      }
    }

    // Save product in MongoDB
    const id = await createProduct({
      name,
      categoryId,
      categoryName,
      description,
      badge,
      rating,
      image: imageUrl,
      color,
      tags,
      visible,
    });

    return NextResponse.json(
      {
        success: true,
        id,
        imageUrl,
      },
      {
        status: 201,
        headers: corsHeaders,
      }
    );
  } catch (error: unknown) {
    console.error(
      "[PRODUCTS POST ERROR]",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to create product.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}