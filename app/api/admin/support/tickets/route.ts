import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthorized } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { createUserNotification } from "@/lib/order-fulfillment";

const updateTicketSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["open", "in_progress", "resolved"])
});

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
