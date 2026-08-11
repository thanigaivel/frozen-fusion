export function getOptimizedImageUrl(
  url: string | undefined,
  width: number
): string {
  if (!url) return "/logo.png";

  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  // Avoid adding transformations twice.
  if (
    url.includes("f_auto") ||
    url.includes("q_auto")
  ) {
    return url;
  }

  return url.replace(
    "/image/upload/",
    `/image/upload/f_auto,q_auto,w_${width}/`
  );
}
