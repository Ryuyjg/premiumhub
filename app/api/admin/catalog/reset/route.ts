import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";

const COLLECTIONS_TO_CLEAR = [
  "products",
  "categories",
  "offers",
  "reviews",
  "coupons",
  "ottAccounts",
  "uropayTransactions"
];

async function deleteCollection(name: string) {
  let deleted = 0;

  while (true) {
    const snapshot = await adminDb.collection(name).limit(200).get();
    if (snapshot.empty) {
      break;
    }

    const batch = adminDb.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
      deleted += 1;
    });
    await batch.commit();
  }

  return deleted;
}

export async function POST() {
  const allowed = await isAdminAuthorized();
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const results = await Promise.all(
    COLLECTIONS_TO_CLEAR.map(async (collection) => ({
      collection,
      deleted: await deleteCollection(collection)
    }))
  );

  return NextResponse.json({
    success: true,
    results
  });
}
