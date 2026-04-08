import { adminDb } from "@/lib/firebase/admin";

export type UroPayWebhookTransaction = {
  referenceNumber: string;
  amount: number;
  from: string | null;
  vpa: string | null;
  environment: string;
  receivedAt: string;
  processedAt?: string | null;
};

function docIdFromReference(referenceNumber: string) {
  return referenceNumber.replace(/[^a-zA-Z0-9_-]/g, "_");
}

export async function saveUroPayWebhookTransaction(
  referenceNumber: string,
  payload: {
    amount: number;
    from?: string | null;
    vpa?: string | null;
    environment: string;
  }
) {
  const transaction: UroPayWebhookTransaction = {
    referenceNumber,
    amount: payload.amount,
    from: payload.from || null,
    vpa: payload.vpa || null,
    environment: payload.environment,
    receivedAt: new Date().toISOString(),
    processedAt: null
  };

  await adminDb.collection("uropayTransactions").doc(docIdFromReference(referenceNumber)).set(transaction, { merge: true });
  return transaction;
}

export async function getUroPayWebhookTransaction(referenceNumber: string) {
  const doc = await adminDb.collection("uropayTransactions").doc(docIdFromReference(referenceNumber)).get();
  if (!doc.exists) {
    return null;
  }

  return doc.data() as UroPayWebhookTransaction;
}

export async function markUroPayWebhookTransactionProcessed(referenceNumber: string) {
  await adminDb.collection("uropayTransactions").doc(docIdFromReference(referenceNumber)).set(
    {
      processedAt: new Date().toISOString()
    },
    { merge: true }
  );
}
