import { forwardRef, useState } from "react";
import Turnstile from "react-cloudflare-turnstile";

// Basit arayüz tanımı
interface TurnstileProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

// Site anahtarını al
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

// Basitleştirilmiş Turnstile bileşeni
export const TurnstileWidget = forwardRef<HTMLDivElement, TurnstileProps>(
  ({ onVerify, onExpire, onError, className }, ref) => {
    const [key] = useState(0);

    console.log("Rendering TurnstileWidget with site key:", TURNSTILE_SITE_KEY ? "present" : "missing");

    if (!TURNSTILE_SITE_KEY) {
      console.error("Turnstile site key is not configured.");
      return (
        <div 
          ref={ref} 
          className={`bg-red-50 border border-red-200 text-red-700 p-3 rounded-md my-2 ${className || ''}`}
        >
          Turnstile configuration error. Please contact support.
        </div>
      );
    }

    return (
      <div ref={ref} className={className}>
        <Turnstile
          key={key}
          sitekey={TURNSTILE_SITE_KEY}
          onSuccess={onVerify}
          onExpire={onExpire}
          onError={onError}
          theme="auto"
        />
      </div>
    );
  }
);

TurnstileWidget.displayName = "TurnstileWidget";