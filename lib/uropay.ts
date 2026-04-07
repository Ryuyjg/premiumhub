import crypto from "crypto";

const UROPAY_BASE_URL = (process.env.UROPAY_BASE_URL || "https://api.uropay.me").replace(/\/$/, "");

type GenerateOrderPayload = {
  amountInPaise: number;
  merchantOrderId: string;
  customerName: string;
  customerEmail: string;
  transactionNote?: string;
  notes?: Record<string, string>;
};

type UpdateOrderPayload = {
  uroPayOrderId: string;
  referenceNumber: string;
  orderStatus?: "CREATED" | "UPDATED" | "COMPLETED" | "FAILED" | "PENDING" | "CANCELLED";
};

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is missing.`);
  }
  return value;
}

export function hashUroPaySecret(secret = getRequiredEnv("UROPAY_SECRET")) {
  return crypto.createHash("sha512").update(secret).digest("hex");
}

function getAuthenticatedHeaders() {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-API-KEY": getRequiredEnv("UROPAY_API_KEY"),
    Authorization: `Bearer ${hashUroPaySecret()}`,
    "Accept-Encoding": "gzip, deflate, br"
  };
}

function toRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

function readData(payload: unknown) {
  return toRecord(toRecord(payload).data);
}

async function readJson(response: Response) {
  return response.json().catch(() => ({}));
}

export async function createUroPayOrder(payload: GenerateOrderPayload) {
  const response = await fetch(`${UROPAY_BASE_URL}/order/generate`, {
    method: "POST",
    headers: getAuthenticatedHeaders(),
    body: JSON.stringify({
      vpa: getRequiredEnv("UROPAY_VPA"),
      vpaName: getRequiredEnv("UROPAY_VPA_NAME"),
      amount: payload.amountInPaise,
      merchantOrderId: payload.merchantOrderId,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      transactionNote: payload.transactionNote,
      notes: payload.notes
    }),
    cache: "no-store"
  });

  const json = await readJson(response);
  if (!response.ok) {
    throw new Error(String(toRecord(json).message || toRecord(json).error || "Unable to create UroPay order."));
  }

  const data = readData(json);
  return {
    raw: json,
    uroPayOrderId: String(data.uroPayOrderId || ""),
    orderStatus: String(data.orderStatus || ""),
    upiString: String(data.upiString || ""),
    qrCode: String(data.qrCode || ""),
    amountInRupees: String(data.amountInRupees || "")
  };
}

export async function updateUroPayOrder(payload: UpdateOrderPayload) {
  const response = await fetch(`${UROPAY_BASE_URL}/order/update`, {
    method: "PATCH",
    headers: getAuthenticatedHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store"
  });

  const json = await readJson(response);
  if (!response.ok) {
    throw new Error(String(toRecord(json).message || toRecord(json).error || "Unable to update UroPay order."));
  }

  const data = readData(json);
  return {
    raw: json,
    uroPayOrderId: String(data.uroPayOrderId || payload.uroPayOrderId),
    orderStatus: String(data.orderStatus || "")
  };
}

export async function getUroPayOrderStatus(uroPayOrderId: string) {
  const response = await fetch(`${UROPAY_BASE_URL}/order/status/${encodeURIComponent(uroPayOrderId)}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-API-KEY": getRequiredEnv("UROPAY_API_KEY"),
      "Accept-Encoding": "gzip, deflate, br"
    },
    cache: "no-store"
  });

  const json = await readJson(response);
  if (!response.ok) {
    throw new Error(String(toRecord(json).message || toRecord(json).error || "Unable to fetch UroPay order status."));
  }

  const data = readData(json);
  return {
    raw: json,
    uroPayOrderId: String(data.uroPayOrderId || uroPayOrderId),
    orderStatus: String(data.orderStatus || "")
  };
}

export function isUroPayCompleted(status: string) {
  return status.toUpperCase() === "COMPLETED";
}

export function isUroPayFailed(status: string) {
  return ["FAILED", "CANCELLED"].includes(status.toUpperCase());
}

export function buildUroPayWebhookSignature(payload: Record<string, unknown>, environment: string) {
  const sortedData = Object.fromEntries(
    Object.entries(payload).sort(([left], [right]) => left.localeCompare(right))
  );

  return crypto
    .createHmac("sha256", hashUroPaySecret())
    .update(JSON.stringify({ ...sortedData, environment }))
    .digest("hex");
}

export function verifyUroPayWebhookSignature(payload: Record<string, unknown>, environment: string, signature: string) {
  const expected = buildUroPayWebhookSignature(payload, environment);
  return expected === signature;
}
