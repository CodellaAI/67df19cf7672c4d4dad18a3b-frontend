
import Link from 'next/link';

export default function EmptyState({ icon, title, description, actionLabel, actionHref }) {
  return (
    <div className="text-center py-12 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-6">
        {icon}
      </div>
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-text-secondary max-w-md mx-auto mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary inline-flex items-center gap-2">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
