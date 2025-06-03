'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signUp } from 'basics/actions/auth';
import { successToast, warningToast } from 'basics/utils/toast';

export default function RegistrationPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    login: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signUp(form);

    setLoading(false);

    if (!result.success) {
      warningToast('Реєстрація невдала, перевірте всі дані');
      return;
    }

    successToast('Ви успішно зареєструвалися');
    router.push('/');
  };

  return (
    <div className="w-full flex min-h-[500px] flex-col justify-center items-center px-5 py-8 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Створити акаунт
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={ handleSubmit } className="space-y-6">
          <div>
            <label htmlFor="login" className="block text-sm font-medium leading-6 text-gray-900">
              Логін
            </label>
            <div className="mt-2">
              <input
                id="login"
                name="login"
                type="text"
                required
                value={ form.login }
                onChange={ handleChange }
                className="block w-full rounded-md border-0 bg-white px-3 py-1.5 text-gray-900 shadow-sm outline-1
                  outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Електронна пошта
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={ form.email }
                onChange={ handleChange }
                className="block w-full rounded-md border-0 bg-white px-3 py-1.5 text-gray-900 shadow-sm outline-1
                  outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Пароль
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={ form.password }
                onChange={ handleChange }
                className="block w-full rounded-md border-0 bg-white px-3 py-1.5 text-gray-900 shadow-sm outline-1
                  outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={ loading }
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white
                shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              { loading ? 'Реєстрація...' : 'Зареєструватись' }
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Вже маєте акаунт?{ ' ' }
          <Link
            className="font-semibold text-indigo-600 hover:text-indigo-500"
            href="/login"
          >
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
}
