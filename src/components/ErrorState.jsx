export default function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
      <div className="font-semibold">Something went wrong</div>
      <div className="mt-1 text-sm opacity-90">{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded-md bg-red-600 px-3 py-2 text-white hover:bg-red-700"
        >
          Retry
        </button>
      )}
    </div>
  );
}

