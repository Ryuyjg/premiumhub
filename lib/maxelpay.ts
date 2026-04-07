const MAXELPAY_BASE_URL = (process.env.MAXELPAY_BASE_URL || "https://api.maxelpay.com").replace(/\/$/, "");

type MaxelPaySessionPayload = {
  orderId: string;
  amount: number;
  currency: string;
  description: string;
  successUrl: string;
  cancelUrl: string;
  callbackUrl: string;
};

function getApiKey() {
  const apiKey = process.env.MAXELPAY_API_KEY;
  if (!apiKey) {
    throw new Error("MaxelPay API key is missing. Set MAXELPAY_API_KEY.");
  }
  return apiKey;
}

function toRecord(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }
  return {};
}

export function readSessionId(payload: unknown): string | null {
  const data = toRecord(payload);
  const nested = toRecord(data.data);
  const candidates = [
    data.sessionId,
    data.session_id,
    data.id,
    data.paymentSessionId,
    nested.sessionId,
    nested.session_id,
    nested.id
  ];
  const id = candidates.find((candidate) => typeof candidate === "string" && candidate.trim().length > 0);
  return typeof id === "string" ? id : null;
}

export function readCheckoutUrl(payload: unknown): string | null {
  const data = toRecord(payload);
  const nested = toRecord(data.data);
  const candidates = [
    data.checkoutUrl,
    data.checkout_url,
    data.hostedUrl,
    data.hosted_url,
    data.paymentUrl,
    data.payment_url,
    data.url,
    nested.checkoutUrl,
    nested.checkout_url,
    nested.hostedUrl,
    nested.hosted_url,
    nested.paymentUrl,
    nested.payment_url,
    nested.url
  ];
  const url = candidates.find((candidate) => typeof candidate === "string" && /^https?:\/\//.test(candidate));
  return typeof url === "string" ? url : null;
}

export function readPaymentStatus(payload: unknown): string | null {
  const data = toRecord(payload);
  const nested = toRecord(data.data);
  const candidates = [data.status, data.paymentStatus, nested.status, nested.paymentStatus];
  const status = candidates.find((candidate) => typeof candidate === "string" && candidate.trim().length > 0);
  return typeof status === "string" ? status.toLowerCase() : null;
}

export function isPaidStatus(status: string | null) {
  if (!status) return false;
  return ["paid", "success", "successful", "completed", "confirmed"].includes(status.toLowerCase());
}

export function isFailedStatus(status: string | null) {
  if (!status) return false;
  return ["failed", "expired", "cancelled", "canceled", "declined"].includes(status.toLowerCase());
}

export async function createMaxelPaySession(payload: MaxelPaySessionPayload) {
  const response = await fetch(`${MAXELPAY_BASE_URL}/api/v1/payments/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": getApiKey()
    },
    body: JSON.stringify(payload),
    cache: "no-store"
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = toRecord(json).message || toRecord(json).error || "Unable to create MaxelPay payment session.";
    throw new Error(String(message));
  }

  return {
    raw: json,
    sessionId: readSessionId(json),
    checkoutUrl: readCheckoutUrl(json)
  };
}

export async function getMaxelPaySessionStatus(sessionId: string) {
  const response = await fetch(`${MAXELPAY_BASE_URL}/api/v1/payments/sessions/${encodeURIComponent(sessionId)}/status`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": getApiKey()
    },
    cache: "no-store"
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = toRecord(json).message || toRecord(json).error || "Unable to fetch MaxelPay session status.";
    throw new Error(String(message));
  }

  return {
    raw: json,
    status: readPaymentStatus(json)
  };
}

