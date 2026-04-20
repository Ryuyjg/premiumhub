function hasProtocol(value: string) {
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(value);
}

function isPhoneLike(value: string) {
  return /^\+?[\d\s()-]{8,}$/.test(value);
}

export function normalizeSupportHref(rawHref: string, fallback = "/support-channels") {
  const href = String(rawHref || "").trim();
  if (!href) {
    return fallback;
  }

  if (href.startsWith("/")) {
    return href;
  }

  if (href.startsWith("mailto:") || href.startsWith("tel:")) {
    return href;
  }

  if (hasProtocol(href)) {
    return ensureSafeHttpUrl(href, fallback);
  }

  if (href.startsWith("@")) {
    const handle = href.slice(1).trim();
    return handle ? `https://t.me/${handle}` : fallback;
  }

  if (href.includes("t.me/") || href.includes("telegram.me/")) {
    return `https://${href.replace(/^\/+/, "")}`;
  }

  if (href.includes("wa.me/") || href.includes("api.whatsapp.com/")) {
    return `https://${href.replace(/^\/+/, "")}`;
  }

  if (isPhoneLike(href)) {
    const digits = href.replace(/\D/g, "");
    return digits ? `https://wa.me/${digits}` : fallback;
  }

  if (href.startsWith("www.")) {
    return ensureSafeHttpUrl(`https://${href}`, fallback);
  }

  return ensureSafeHttpUrl(`https://${href}`, fallback);
}

function ensureSafeHttpUrl(candidate: string, fallback: string) {
  try {
    const url = new URL(candidate);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
    return fallback;
  } catch {
    return fallback;
  }
}
