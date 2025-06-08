'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { signInWithCredentials } from 'basics/actions/auth';
import { successToast, warningToast } from 'basics/utils/toast';

export default function LoginPage() {
  const router = useRouter();
  const [emailOrLogin, setEmailOrLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signInWithCredentials({ identifier: emailOrLogin, password });

    if (result.success) {
      successToast('Ви успішно увійшли');
      await router.push('/');
    } else {
      warningToast('Логін, пошта чи пароль неправильні');
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-8 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Увійдіть до свого акаунту
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={ handleSubmit }>
          <div>
            <label htmlFor="emailOrLogin" className="block text-sm font-medium text-gray-900">
              Електронна пошта або логін
            </label>
            <div className="mt-2">
              <input
                id="emailOrLogin"
                name="emailOrLogin"
                type="text"
                autoComplete="username"
                required
                value={ emailOrLogin }
                onChange={ (e) => setEmailOrLogin(e.target.value) }
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1
                  outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              Пароль
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={ password }
                onChange={ (e) => setPassword(e.target.value) }
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1
                  outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold
                text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              Увійти
            </button>
          </div>
        </form>

        <div className="mt-4">
          <button
            type="button"
            onClick={ () => signIn('google') }
            className="flex w-full justify-center rounded-md bg-white border border-gray-300 px-3 py-1.5 text-sm font-semibold
      text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            Увійти через Google
          </button>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Не маєте акаунту?{ ' ' }
          <Link
            className="font-semibold text-indigo-600 hover:text-indigo-500"
            href="/registration"
          >
            Зареєструйтесь
          </Link>
        </p>
      </div>
    </div>
  );
}
