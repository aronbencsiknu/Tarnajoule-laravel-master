import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="relative h-screen w-screen overflow-hidden">
  {/* Background image */}
  <img
    src="/images/auth-bg.png"
    alt="Welcome Background"
    className="absolute inset-0 h-full w-full object-cover"
  />

  {/* Dark semi-transparent overlay (no blur!) */}
  <div className="absolute inset-0 bg-black/40" />

  {/* Centered blurred box */}
  <div className="relative z-10 flex h-full w-full items-center justify-center">
    <div className="rounded-xl bg-white/50 p-8 shadow-xl backdrop-blur-md dark:bg-black/30">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-semibold text-black dark:text-white text-center">Welcome to the  <br />TarnaJoule Dashboard</h1>
        <div className="flex gap-4">
          <Link
            href={route('login')}
            className="rounded-md border border-white/20 bg-white/30 px-6 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/60 hover:text-black dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10"
          >
            Log in
          </Link>
          <Link
            href={route('register')}
            className="rounded-md border border-white/20 bg-white/30 px-6 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/60 hover:text-black dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  </div>
</div>

        </>
    );
}
