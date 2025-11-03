import { cn } from "@/lib/utils";

export const DECATHLON_LOGO_SRC =
  "https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2F9816efd05f164ba6a56e9aeacaff5bbb?format=webp&width=800";

type DecathlonLogoProps = {
  className?: string;
  "aria-label"?: string;
  /**
   * Controls the logo color.
   * Use "white" on dark or blue backgrounds, and "blue" on light backgrounds.
   */
  variant?: "blue" | "white";
};

export function DecathlonLogo({
  className,
  variant = "blue",
  "aria-label": ariaLabel,
}: DecathlonLogoProps) {
  const baseClass = "h-10 w-auto";
  const variantClass = variant === "white" ? "filter brightness-0 invert" : "";
  const mergedClass = [baseClass, variantClass, className].filter(Boolean).join(" ");

  return (
    <img
      src={DECATHLON_LOGO_SRC}
      alt={ariaLabel ?? "Logo Decathlon"}
      className={mergedClass}
      loading="lazy"
      decoding="async"
    />
  );
}

export default DecathlonLogo;
