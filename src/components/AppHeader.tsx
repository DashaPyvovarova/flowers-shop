'use client';

import Link from 'next/link';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

const AppHeader = ({ session }: { session: Session | null }) => {
  const userRole = session?.user?.role;

  return (
    <header className="h-16 bg-indigo-600 text-white flex items-center justify-between px-6 shadow-md">
      <nav className="flex items-center justify-between space-x-6 flex-1 mr-10">
        <div>
          <Link href="/" className="text-xl font-semibold hover:text-indigo-200 transition">
            🌸 Flower Store
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="/shop"
            className="hover:text-indigo-200 transition text-m font-medium"
          >
            Магазин
          </Link>
          {
            session && (
              <>
                <Link
                  href="/orders"
                  className="hover:text-indigo-200 transition text-m font-medium"
                >
                  Замовлення
                </Link>
                <Link
                  href="/profile"
                  className="hover:text-indigo-200 transition text-m font-medium"
                >
                  Профіль
                </Link>
              </>
            )
          }
          {
            userRole === 'Administrator' && (
              <Link
                href="/admin"
                className="ml-10 hover:text-indigo-200 transition text-m font-medium"
              >
                Адміністрування
              </Link>
            )
          }
        </div>
      </nav>

      <div className="flex items-center gap-4">
        {
          session ? (
            <>
              <span className="hidden sm:inline">
              Вітаємо, { session.user?.login || session.user?.email }
              </span>
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
