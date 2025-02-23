import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/utils/dbclient";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const token = cookies().get("token");
    if (!token)
      return NextResponse.json({ error: "No token provided" }, { status: 401 });

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token.value, secretKey);
    const { representative_id } = payload;
    const data = await prisma.internship.findMany({
      where: { posted_by: representative_id as string },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
