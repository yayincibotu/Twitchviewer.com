import React, { useEffect, useRef, useId } from 'react';

interface BasicTurnstileProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export function BasicTurnstile({ onVerify, onExpire, onError, className }: BasicTurnstileProps) {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const turnstileId = useId();

  useEffect(() => {
    // Turnstile script yükleme
    if (!document.getElementById('cf-turnstile-script')) {
      const script = document.createElement('script');
      script.id = 'cf-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = renderTurnstile;
    } else {
      // Script zaten yüklenmişse, widget'ı oluştur
      if (window.turnstile) {
        renderTurnstile();
      }
    }

    function renderTurnstile() {
      if (containerRef.current && window.turnstile && !widgetId.current) {
        try {
          widgetId.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              console.log('Turnstile verified:', token?.substring(0, 10) + '...');
              onVerify(token);
            },
            'expired-callback': () => {
              console.log('Turnstile token expired');
              if (onExpire) onExpire();
            },
            'error-callback': (error: string) => {
              console.error('Turnstile error:', error);
              if (onError) onError(error);
            },
            theme: 'auto',
          });
          console.log('Turnstile widget rendered with ID:', widgetId.current);
        } catch (error) {
          console.error('Error rendering Turnstile widget:', error);
          if (onError) onError(String(error));
        }
      }
    }

    return () => {
      // Cleanup
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, [siteKey, onVerify, onExpire, onError]);

  console.log("BasicTurnstile rendering with site key:", siteKey ? "present" : "missing");
  
  if (!siteKey) {
    console.error("Turnstile site key is not configured");
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md my-2">
        Turnstile configuration error. Please contact support.
      </div>
    );
  }
  
  return (
    <div 
      id={`cf-turnstile-${turnstileId}`} 
      ref={containerRef} 
      className={`cf-turnstile ${className || ''}`}
      data-sitekey={siteKey}
    />
  );
}

// Global type definition for Turnstile
declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}