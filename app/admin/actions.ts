'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'boramedia2025';

export async function loginAction(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const password = formData.get('password') as string;

  if (password === ADMIN_PASSWORD) {
    cookies().set('bm_admin_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/',
      sameSite: 'lax',
    });
    redirect('/admin');
  }

  return { error: '비밀번호가 올바르지 않습니다.' };
}

export async function logoutAction() {
  cookies().delete('bm_admin_token');
  redirect('/admin/login');
}
