/* eslint-disable no-console */

'use server';

import { hash } from 'bcryptjs';
import { eq, or } from 'drizzle-orm';
import { db } from '../../../database/drizzle';
import { users } from '../../../database/schema';
import { signIn } from 'lib/auth';

type AuthCredentials = {
  id: string;
  login: string;
  email: string;
  password: string;
};

type SignInParamsType = {
  identifier: string;
  password: string;
};

export const signInWithCredentials = async (params: SignInParamsType) => {
  const { identifier, password } = params;
  console.log(identifier);
  console.log(password);

  try {
    const result = await signIn('credentials', {
      identifier,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.log(error, 'Signup error');
    return { success: false, error: 'Signup error' };
  }
};

export const signUp = async (params: Omit<AuthCredentials, 'id'>) => {
  const { password, email, login } = params;
  console.log(params);

  const existingUser = await db
    .select()
    .from(users)
    .where(or(eq(users.email, email), eq(users.login, login)))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, error: 'User already exists' };
  }

  const hashedPassword = await hash(password, 10);

  try {
    await db.insert(users).values({
      login,
      email,
      password: hashedPassword,
    });

    const identifier = login || email;

    await signInWithCredentials({ identifier, password });

    return { success: true };
  } catch (error) {
    console.log(error, 'Signup error');
    return { success: false, error: 'Signup error' };
  }
};
