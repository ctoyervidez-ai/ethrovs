type CloudflareRequest = Request & {
  cf?: {
    city?: string;
    country?: string;
    region?: string;
  };
};

export async function GET(request: Request) {
  const cloudflareRequest = request as CloudflareRequest;
  const countryFromRuntime = cloudflareRequest.cf?.country?.toUpperCase();
  const country = (
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-vercel-ip-country") ??
    (countryFromRuntime === "XX" ? "" : countryFromRuntime) ??
    ""
  ).toUpperCase();
  const city = cloudflareRequest.cf?.city ?? request.headers.get("cf-ipcity") ?? "";
  const region = cloudflareRequest.cf?.region ?? request.headers.get("cf-region") ?? "";
  const browserPrefersEnglish = request.headers.get("accept-language")?.toLowerCase().startsWith("en") ?? false;

  const language = country === "US" ? "en" : country === "MX" ? "es" : browserPrefersEnglish ? "en" : "es";

  return Response.json(
    { city, country, language, region },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
