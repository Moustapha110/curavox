export interface LoadingDotsProps {
  className?: string;
  label?: string;
  dotClassName?: string;
}

export function LoadingDots({
  className = "",
  label = "Assistant is typing",
  dotClassName = "bg-mist",
}: LoadingDotsProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-flex items-center gap-1 ${className}`}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden
          className={`block h-2 w-2 rounded-full animate-typing ${dotClassName}`}
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </span>
  );
}

export default LoadingDots;
