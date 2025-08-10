'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // NOTE: relative path from /components

export default function Header() {
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setHasSession(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setHasSession(!!session)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-black/10 backdrop-blur px-6 py-4">
      <div className="text-sm opacity-70">PolyTrack</div>
      <div>
        {hasSession ? (
          <button
            className="text-sm opacity-80 hover:opacity-100"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.reload();
            }}
          >
            Sign out
          </button>
        ) : (
          <Link href="/login" className="text-sm opacity-80 hover:opacity-100">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
