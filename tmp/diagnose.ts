import { adminDb } from "../lib/firebase/admin";

async function diagnose() {
  const snapshot = await adminDb.collection("orders").orderBy("createdAt", "desc").limit(5).get();
  const results = snapshot.docs.map(doc => ({
    id: doc.id,
    status: doc.data().status,
    error: doc.data().fulfillmentError,
    failedAt: doc.data().fulfillmentFailedAt,
    productId: doc.data().productId
  }));
  console.log(JSON.stringify(results, null, 2));
}

diagnose();
