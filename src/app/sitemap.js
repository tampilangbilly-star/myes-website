import { SITE_URL } from "@/lib/seo";

const PATHS = ["", "/about", "/personnel", "/program", "/activities", "/mission", "/care", "/news", "/contact"];

export default function sitemap() {
  const now = new Date();
  return PATHS.map((p) => ({ url: `${SITE_URL}${p}`, lastModified: now, changeFrequency: "weekly", priority: p === "" ? 1 : 0.7 }));
}
