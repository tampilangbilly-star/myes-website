import Icon from "./Icon";

export default function EmptyState({ icon = "sparkle", title, text, action }) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <Icon name={icon} size={26} />
      </span>
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
      {text && <p className="mt-1 max-w-sm text-sm text-ink-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
