import { NextResponse } from "next/server";
import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { isAdminAuthorized } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { createUserNotification } from "@/lib/order-fulfillment";

const updateTicketSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["open", "in_progress", "resolved"])
});

const replyTicketSchema = z.object({
  id: z.string().min(1),
  message: z.string().min(1).max(3000)
});

function createMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function GET() {
  const allowed = await isAdminAuthorized();
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const snapshot = await adminDb.collection("supportTickets").orderBy("createdAt", "desc").limit(200).get();
  return NextResponse.json(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
}

export async function PUT(request: Request) {
  const allowed = await isAdminAuthorized();
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const parsed = updateTicketSchema.parse(await request.json());
    const ref = adminDb.collection("supportTickets").doc(parsed.id);
    const doc = await ref.get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
    }
    const ticket = doc.data()!;
    await ref.update({ status: parsed.status, updatedAt: new Date().toISOString() });

    await createUserNotification(
      String(ticket.userId),
      "Support ticket updated",
      `Your ticket "${ticket.subject}" is now ${parsed.status.replace("_", " ")}.`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update ticket." },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  const allowed = await isAdminAuthorized();
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const parsed = replyTicketSchema.parse(await request.json());
    const ref = adminDb.collection("supportTickets").doc(parsed.id);
    const doc = await ref.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
    }

    const ticket = doc.data()!;
    const timestamp = new Date().toISOString();
    await ref.update({
      messages: FieldValue.arrayUnion({
        id: createMessageId(),
        sender: "admin",
        body: parsed.message,
        email: "admin",
        createdAt: timestamp
      }),
      status: "in_progress",
      updatedAt: timestamp,
      lastMessageAt: timestamp
    });

    await createUserNotification(String(ticket.userId), "Support replied", `Admin replied to "${ticket.subject}".`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to send support reply." },
      { status: 400 }
    );
  }
}
