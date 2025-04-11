import React from 'react';
import Turnstile from 'react-cloudflare-turnstile';

interface BasicTurnstileProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export function BasicTurnstile({ onVerify, onExpire, onError, className }: BasicTurnstileProps) {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string;
  
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
    <div className={className}>
      <Turnstile
        sitekey={siteKey}
        onSuccess={onVerify}
        onExpire={onExpire}
        onError={onError}
        theme="auto"
      />
    </div>
  );
}