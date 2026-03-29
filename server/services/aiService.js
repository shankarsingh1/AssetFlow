/**
 * AI card image URL via Pollinations.ai (free, no API key).
 * Returns a direct image URL; the browser/CDN serves the rendered image.
 */

export function generateCard(imageUrl, title) {
  const prompt = `Collectible trading card art featuring "${title}". 
Fantasy TCG style, ornate holographic border, glowing magical effects, 
card title at the bottom, professional trading card game illustration, 
vibrant colors, epic fantasy artwork`;

  const encoded = encodeURIComponent(prompt);
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encoded}?width=512&height=768&nologo=true&seed=${Date.now()}`;

  return pollinationsUrl;
}
