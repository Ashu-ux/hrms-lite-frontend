export default function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center">
      <div className="text-lg font-semibold">{title}</div>
      {description && <div className="mt-1 text-sm text-gray-600">{description}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

