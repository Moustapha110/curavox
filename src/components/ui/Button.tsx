"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode, ButtonHTMLAttributes, MouseEvent } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  ariaLabel?: string;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  target?: string;
  rel?: string;
}

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-[transform,box-shadow,background-color,color,border-color] duration-300 ease-out-expo select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

const variants: Record<ButtonVariant, string> = {
  primary:
    "text-canvas bg-ink hover:bg-ink-deep shadow-[0_1px_3px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.16)]",
  secondary:
    "text-ink bg-surface border border-line hover:border-line-strong hover:shadow-card",
  ghost:
    "text-mist hover:text-ink hover:bg-ink/5",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[15px]",
  lg: "h-13 px-8 text-base",
};

function Spinner() {
  return (
    <span
      aria-hidden
      className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-80"
    />
  );
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className = "",
  disabled,
  loading,
  type = "button",
  onClick,
  ariaLabel,
  fullWidth,
  icon,
  iconRight,
  target,
  rel,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${
    fullWidth ? "w-full" : ""
  } ${className}`;

  const content = (
    <>
      {loading ? <Spinner /> : icon}
      <span>{children}</span>
      {iconRight}
    </>
  );

  if (href) {
    return (
      <motion.span
        whileTap={disabled ? undefined : { scale: 0.97 }}
        whileHover={disabled ? undefined : { y: -1 }}
        className={`inline-flex ${fullWidth ? "w-full" : ""}`}
      >
        <Link
          href={href}
          className={classes}
          aria-label={ariaLabel}
          aria-disabled={disabled}
          onClick={onClick}
          target={target}
          rel={rel}
          tabIndex={disabled ? -1 : undefined}
        >
          {content}
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.button
      type={type}
      whileTap={disabled || loading ? undefined : { scale: 0.97 }}
      whileHover={disabled || loading ? undefined : { y: -1 }}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={loading}
    >
      {content}
    </motion.button>
  );
}

export default Button;
