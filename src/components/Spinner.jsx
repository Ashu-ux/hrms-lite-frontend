export default function Spinner({ className = "" }) {
  return (
    <div
      className={`bb-spinner inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-800 ${className}`}
      aria-label="Loading"
      role="status"
    />
  );
}

