import { forwardRef, useId, useState, useEffect, useRef } from "react";
import Turnstile from "react-cloudflare-turnstile";

interface TurnstileProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

export const TurnstileWidget = forwardRef<HTMLDivElement, TurnstileProps>(
  ({ onVerify, onExpire, onError, className, ...props }, ref) => {
    const id = useId();
    const [key, setKey] = useState(0);
    const turnstileRef = useRef<any>(null);

    // Reset the component if needed
    const reset = () => {
      setKey(prevKey => prevKey + 1);
    };

    // Expose the reset function to parent components
    useEffect(() => {
      if (ref && 'current' in ref) {
        (ref as any).current = {
          reset
        };
      }
    }, [ref]);

    if (!TURNSTILE_SITE_KEY) {
      console.error("Turnstile site key is not configured. Please set VITE_TURNSTILE_SITE_KEY environment variable.");
      return (
        <div 
          ref={ref} 
          className={`bg-red-50 border border-red-200 text-red-700 p-3 rounded-md my-2 ${className}`}
        >
          Turnstile configuration error. Please contact support.
        </div>
      );
    }

    return (
      <div ref={ref} className={className} {...props}>
        <Turnstile
          key={key}
          turnstileSiteKey={TURNSTILE_SITE_KEY}
          callback={onVerify}
          expiredCallback={onExpire || reset}
          errorCallback={onError}
          theme="auto"
          className="mt-2"
        />
      </div>
    );
  }
);

TurnstileWidget.displayName = "TurnstileWidget";