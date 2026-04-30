export default function EmptyState({
  icon = "🔍",
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="text-5xl mb-5 opacity-60">{icon}</div>
      <h3 className="font-display font-bold text-white text-xl mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-ink-dim text-sm max-w-sm leading-relaxed mb-6">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
