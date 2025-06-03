'use client';

import Link from 'next/link';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

const AppHeader = ({ session }: { session: Session | null }) => {
  return (
    <header className="h-16 bg-indigo-600 text-white flex items-center justify-between px-6 shadow-md">
      <Link href="/" className="text-xl font-semibold hover:text-indigo-200 transition">
        🌸 Flower Store
      </Link>

      <div className="flex items-center gap-4">
        {
          session ? (
            <>
              <span className="hidden sm:inline">Вітаємо, { session.user?.login || session.user?.email }</span>
              <button
                onClick={ () => signOut() }
                className="bg-white text-indigo-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-100 transition"
              >
              Вийти
              </button>
            </>
          ) : (
            <Link
              href="/signin"
              className="bg-white text-indigo-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-100 transition"
            >
            Увійти
            </Link>
          )
        }
      </div>
    </header>
  );
};

export default AppHeader;
