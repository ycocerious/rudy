import { db } from "@/server/db";
import { tasks } from "@/server/db/schema";
import { NextResponse } from "next/server";

export const GET = async () => {
  const x = await db.select().from(tasks);
  console.log(x);
  return new NextResponse("Active", { status: 401 });
};
