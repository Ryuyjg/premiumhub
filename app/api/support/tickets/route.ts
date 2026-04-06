import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { createUserNotification } from "@/lib/order-fulfillment";

const ticketSchema = z.object({
  subject: z.string().min(3),
  message: z.string().min(10)
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const snapshot = await adminDb
    .collection("supportTickets")
    .where("userId", "==", user.id)
    .limit(50)
    .get();
  const tickets = snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => (String(a.createdAt || "") > String(b.createdAt || "") ? -1 : 1));

  return NextResponse.json(tickets);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const parsed = ticketSchema.parse(await request.json());
    const ref = await adminDb.collection("supportTickets").add({
      userId: user.id,
      email: user.email,
      subject: parsed.subject,
      message: parsed.message,
      status: "open",
      createdAt: new Date().toISOString()
    });

    await createUserNotification(user.id, "Support ticket created", `Ticket "${parsed.subject}" has been created.`);

    return NextResponse.json({ id: ref.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create support ticket." },
      { status: 400 }
    );
  }
}
