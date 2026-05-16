export default function FormField({
  label,
  hint,
  error,
  children
}) {
  return (
    <div>
      {label && <div className="mb-1 text-sm font-medium text-gray-700">{label}</div>}
      {children}
      {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
      {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
    </div>
  );
}

