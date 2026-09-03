import type { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";

export const DEFAULT_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917012958322";

export function getWhatsAppOrderUrl(product: Product, quantity: number = 1): string {
  const number = DEFAULT_WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
  const priceFormatted = formatCurrency(product.salePrice || product.price);
  
  const text = `Hi! I would like to order:

📦 *Product:* ${product.name}
📂 *Category:* ${product.categoryName}
⏳ *Duration:* ${product.durationInDays} Days
💰 *Price:* ${priceFormatted}
🔢 *Quantity:* ${quantity}

Please confirm availability & payment instructions. Thank you!`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
