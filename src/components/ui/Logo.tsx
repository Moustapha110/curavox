import Link from "next/link";
import { APP_NAME, ROUTES } from "@/lib/constants";

export interface LogoProps {
  withImpiricus?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string | null;
  className?: string;
  markOnly?: boolean;
  dark?: boolean; // kept for API compat, ignored — uses CSS tokens
}

const markSizes = { sm: 26, md: 32, lg: 44 } as const;
const textSizes = { sm: "text-base", md: "text-lg", lg: "text-2xl" } as const;

export function LogoMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <defs>
        <linearGradient id="cv-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F75E5E" />
          <stop offset="1" stopColor="#E04747" />
        </linearGradient>
      </defs>
      <path
        d="M24 5C13.5 5 5 12.4 5 21.6c0 4.9 2.5 9.3 6.4 12.3L9.6 42l9.2-4.6c1.7.4 3.4.6 5.2.6 10.5 0 19-7.4 19-16.6S34.5 5 24 5Z"
        fill="url(#cv-grad)"
      />
      <path
        d="M12.5 22.5h5l2.6-6.2 4 12.4 3.4-9 2.2 4h5.8"
        stroke="#FFFFFF"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  withImpiricus = false,
  size = "md",
  href = ROUTES.home,
  className = "",
  markOnly = false,
}: LogoProps) {
  const inner = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={markSizes[size]} className="shrink-0" />
      {!markOnly && (
        <span className="flex flex-col leading-none">
          <span className={`font-display font-bold tracking-tight text-ink ${textSizes[size]}`}>
            {APP_NAME}
          </span>
          {withImpiricus && (
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-mist">
              by Impiricus
            </span>
          )}
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label={`${APP_NAME} home`} className="inline-flex items-center">
        {inner}
      </Link>
    );
  }
  return inner;
}

export default Logo;
