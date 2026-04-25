export async function GET() {
  return new Response("heleket=e122e7a0", {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=60"
    }
  });
}
