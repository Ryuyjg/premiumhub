import { NextResponse } from "next/server";
import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { getCurrentUser } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { createUserNotification } from "@/lib/order-fulfillment";

type SupportTicketDoc = {
  id: string;
  userId: string;
  email: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved";
  createdAt?: string;
};

const ticketSchema = z.object({
  subject: z.string().min(3),
  message: z.string().min(3)
});

const replySchema = z.object({
  id: z.string().min(1),
  message: z.string().min(1).max(3000)
});

function createMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

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
    .map((doc) => ({ id: doc.id, ...doc.data() }) as SupportTicketDoc)
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
    const timestamp = new Date().toISOString();
    const message = {
      id: createMessageId(),
      sender: "user" as const,
      body: parsed.message,
      email: user.email,
      createdAt: timestamp
    };

    const ref = await adminDb.collection("supportTickets").add({
      userId: user.id,
      email: user.email,
      subject: parsed.subject,
      message: parsed.message,
      messages: [message],
      status: "open",
      createdAt: timestamp,
      updatedAt: timestamp,
      lastMessageAt: timestamp
    });

    await createUserNotification(user.id, "Support ticket created", `Ticket "${parsed.subject}" has been created.`);

    return NextResponse.json({ id: ref.id });
  } catch (error) {
    return NextResponse.json(
      { error: "Subject and message must be at least 3 characters." },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const parsed = replySchema.parse(await request.json());
    const ref = adminDb.collection("supportTickets").doc(parsed.id);
    const doc = await ref.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
    }

    const ticket = doc.data() as SupportTicketDoc;
    if (String(ticket.userId) !== user.id) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const timestamp = new Date().toISOString();
    await ref.update({
      messages: FieldValue.arrayUnion({
        id: createMessageId(),
        sender: "user",
        body: parsed.message,
        email: user.email,
        createdAt: timestamp
      }),
      message: parsed.message,
      status: "open",
      updatedAt: timestamp,
      lastMessageAt: timestamp
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Message must not be empty." },
      { status: 400 }
    );
  }
}
