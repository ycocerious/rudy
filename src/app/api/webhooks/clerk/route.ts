import { env } from "@/env";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { type WebhookEvent } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = (await req.json()) as WebhookEvent;
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  try {
    // Handle user.created event
    if (evt.type === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;

      await db.insert(users).values({
        clerkId: id,
        email: email_addresses[0]?.email_address ?? "",
        firstName: first_name ?? "",
        lastName: last_name ?? "",
        imageUrl: image_url ?? "",
      });
    }

    // Handle user.updated event
    else if (evt.type === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;

      await db
        .update(users)
        .set({
          email: email_addresses[0]?.email_address ?? "",
          firstName: first_name ?? null,
          lastName: last_name ?? null,
          imageUrl: image_url ?? null,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, id));
    }

    // Handle user.deleted event
    else if (evt.type === "user.deleted") {
      const { id } = evt.data;

      if (!id) {
        throw new Error("Missing user ID in delete event");
      }

      await db.delete(users).where(eq(users.clerkId, id));
    }
  } catch (err) {
    console.error("Error processing webhook event: ", err);
    return new Response(`Error processing webhook event: ${evt.type}`, {
      status: 400,
    });
  }

  return new Response("User changes successfully reflected in db", {
    status: 200,
  });
}
