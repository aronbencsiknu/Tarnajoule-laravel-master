import { Head } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

interface AuthLayoutProps {
  title: string;
  description?: string;
}

export default function AuthLayout({ title, description, children }: PropsWithChildren<AuthLayoutProps>) {
  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-neutral-900 text-white">
      {/* Background image */}
      <img
        src="/images/auth-bg.png"
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark overlay (no blur here) */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Centered content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl bg-white/70 p-8 shadow-xl backdrop-blur-md dark:bg-black/30">
          <h1 className="mb-2 text-2xl font-semibold text-black dark:text-white">{title}</h1>
          {description && (
            <p className="mb-6 text-sm text-neutral-700 dark:text-neutral-300">{description}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
