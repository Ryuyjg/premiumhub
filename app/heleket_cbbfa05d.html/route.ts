export async function GET() {
  return new Response("heleket=cbbfa05d", {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=60"
    }
  });
}
