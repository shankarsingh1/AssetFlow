/** Normalize user id from API (id or _id) for comparisons and URLs. */
export function getUserId(user) {
  if (!user) return null;
  const raw = user.id ?? user._id;
  if (raw == null) return null;
  if (typeof raw === 'object' && raw.toString) return raw.toString();
  return String(raw);
}
