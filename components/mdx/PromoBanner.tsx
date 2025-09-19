import Image from "next/image";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import FlexRibbonWrap from "../bespoke/flex-ribbon-wrap";

interface PromoBannerProps {
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  image?: string;
  imageAlt?: string;
  variant?: "default" | "primary" | "success" | "warning";
  ribbon?: string;
}

export const PromoBanner = ({
  title,
  description,
  buttonText,
  buttonLink,
  image,
  imageAlt,
  variant = "default",
  ribbon,
  ...props
}: PromoBannerProps) => {
  const variantStyles = {
    default: "bg-gradient-to-r from-muted to-muted/50 border-border",
    primary: "bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20",
    success:
      "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800",
    warning:
      "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border-yellow-200 dark:border-yellow-800",
  };

  const buttonStyles = {
    default: "bg-foreground text-background hover:bg-foreground/90",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    success: "bg-green-600 text-white hover:bg-green-700",
    warning: "bg-yellow-600 text-white hover:bg-yellow-700",
  };

  const bannerContent = (
    <div
      className={cn(
        "p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg",
        variantStyles[variant],
      )}
      {...props}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        {/* Image section */}
        {image && (
          <div className="flex-shrink-0 order-1 md:order-none">
            <div className="w-full h-32 sm:w-64 sm:h-36 md:w-56 md:h-32 rounded-lg overflow-hidden bg-background border flex items-center justify-center mx-auto md:mx-0">
              <Image
                src={image}
                alt={imageAlt || title}
                width={224}
                height={128}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        )}

        {/* Content section */}
        <div className="flex-1 text-center md:text-left order-2 md:order-none">
          <h3 className="text-xl sm:text-2xl font-bold mb-2 text-foreground">
            {title}
          </h3>
          {description && (
            <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
              {description}
            </p>
          )}

          {/* Button section - under description on md+, centered on mobile */}
          {buttonText && buttonLink && (
            <div className="flex justify-center md:justify-end">
              <a
                href={buttonLink}
                className={cn(
                  "inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base",
                  buttonStyles[variant],
                )}
                target={buttonLink.startsWith("http") ? "_blank" : undefined}
                rel={
                  buttonLink.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
              >
                {buttonText}
                <ArrowRight size={16} className="ml-2" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mb-4">
      {ribbon ? (
        <FlexRibbonWrap
          text={ribbon}
          variant="warning"
          position="top-left"
          size="sm"
        >
          {bannerContent}
        </FlexRibbonWrap>
      ) : (
        bannerContent
      )}
    </div>
  );
};
