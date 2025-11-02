import { cn } from "@/lib/utils";

export const DECATHLON_LOGO_SRC =
  "https://cdn.builder.io/api/v1/image/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2F9816efd05f164ba6a56e9aeacaff5bbb?format=webp&width=800";

type DecathlonLogoProps = {
  className?: string;
  "aria-label"?: string;
};

export function DecathlonLogo({ className, "aria-label": ariaLabel }: DecathlonLogoProps) {
  return (
    <img
      src={DECATHLON_LOGO_SRC}
      alt={ariaLabel ?? "Logo Decathlon"}
      className={cn("h-10 w-auto", className)}
      loading="lazy"
      decoding="async"
    />
  );
}

export default DecathlonLogo;
