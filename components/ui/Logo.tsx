import { cn } from '@/lib/utils';

/** The torch/goblet "T+U" monogram with the flame, as a standalone icon. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="538 0 266 594"
      className={cn('h-10 w-10', className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M800.863 319.753H706.717V425.26H706.705C706.276 440.573 693.728 452.855 678.312 452.855C662.895 452.855 650.348 440.573 649.918 425.26H649.906V319.753H554.138V262.942H800.863V319.753Z"
        className="fill-primary-600"
      />
      <path
        d="M611 470.709H611.072C611.072 479.416 612.794 488.036 616.139 496.08C619.484 504.123 624.387 511.432 630.569 517.588C636.75 523.745 644.088 528.628 652.164 531.959C660.24 535.291 668.896 537.006 677.638 537.006C686.38 537.006 695.035 535.291 703.112 531.959C711.188 528.628 718.526 523.745 724.707 517.588C730.889 511.432 735.792 504.123 739.137 496.08C741.84 489.58 743.483 482.703 744.014 475.709H744V358.709H801V470.709H801.138C801.138 486.862 797.944 502.856 791.738 517.779C785.531 532.702 776.434 546.262 764.966 557.683C753.498 569.105 739.883 578.165 724.9 584.346C709.916 590.528 693.856 593.709 677.638 593.709C661.42 593.709 645.36 590.528 630.376 584.346C615.393 578.165 601.778 569.105 590.31 557.683C578.842 546.262 569.745 532.702 563.538 517.779C557.973 504.398 554.832 490.155 554.241 475.709H554V358.709H611V470.709Z"
        className="fill-primary-600"
      />
      <path
        d="M668.676 0C712.963 26.1901 728.824 64.777 705.69 116.644C724.268 109.074 737.863 93.9835 753.131 67.4141C781.637 130.189 780.626 165.353 725.948 227.975C675.721 208.456 657.877 188.305 657.451 138.354C628.379 155.951 623.575 183.001 649.467 225.438C592.58 202.19 542.912 131.566 601.625 82.6367C660.338 33.7074 671.374 24.2326 668.676 0Z"
        className="fill-secondary-600"
      />
    </svg>
  );
}

interface LogoProps {
  variant?: 'splash' | 'sidebar' | 'compact';
  className?: string;
  iconClassName?: string;
  /** Use on dark backgrounds (e.g. the admin sidebar) so the wordmark stays legible. */
  light?: boolean;
}

/**
 * Full bilingual lockup — Arabic "طموح" stacked above (or beside) the Latin
 * "Tomouh", paired with the icon mark. Composition mirrors the two layouts
 * found in the Figma file: horizontal (splash) and stacked (sidebar).
 */
export function Logo({ variant = 'sidebar', className, iconClassName, light = false }: LogoProps) {
  if (variant === 'splash') {
    return (
      <div className={cn('flex items-center gap-6', className)}>
        <div className="flex flex-col items-start gap-1">
          <span className="font-arabic text-5xl leading-none text-secondary-500">طموح</span>
          <span className="font-heading text-3xl font-semibold leading-none text-primary-100">
            Tomouh
          </span>
        </div>
        <LogoMark className={cn('h-20 w-20', iconClassName)} />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <LogoMark className={cn('h-8 w-8', iconClassName)} />
        <span className={cn('font-heading text-lg font-semibold', light ? 'text-white' : 'text-primary-700')}>
          Tomouh
        </span>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center gap-1.5', className)}>
      <LogoMark className={cn('h-12 w-12', iconClassName)} />
      <div className="flex flex-col items-center leading-none">
        <span className={cn('font-arabic text-xl', light ? 'text-secondary-400' : 'text-secondary-600')}>طموح</span>
        <span className={cn('font-heading text-sm font-semibold', light ? 'text-white' : 'text-primary-700')}>
          Tomouh
        </span>
      </div>
    </div>
  );
}