export default function LoadingSpinner({ className = '' }) {
  return (
    <div
      className={`inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
