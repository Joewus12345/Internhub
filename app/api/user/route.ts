import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const token = cookies().get("token");
    if (!token)
      return NextResponse.json(
        { user: null, message: "no token found" },
        { status: 200 }
      );

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token.value, secretKey);

    let user = null;
    if (payload.role === "recruit") {
      user = {
        name: payload.name,
        profile: payload.profile_url,
        company: payload.company,
      };
    } else if (payload.role === "student") {
      user = {
        name: payload.name,
        id: payload.id,
      };
    }
    return NextResponse.json(user, {
      status: 200,
      statusText: "sucess",
    });
  } catch (error) {
    console.log("GET /api/user error:", error);
    return NextResponse.json(
      { error: "Failed to get user info", details: String(error) },
      { status: 500 }
    );
  }
}
