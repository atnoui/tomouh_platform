import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { isLocale, defaultLocale } from '@/lib/i18n/config';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Topbar } from '@/components/layout/Topbar';

export default async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = getDictionary(locale);

  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).maybeSingle();

  if (!profile) {
    // Same reasoning as the student dashboard layout — no redirect here.
    return (
      <div className="flex min-h-screen items-center justify-center p-8 text-center">
        <div className="max-w-sm">
          <p className="font-heading text-lg font-semibold text-ink-900">{dict.auth.errorGeneric}</p>
          <Link href={`/${locale}/login`} className="mt-3 inline-block text-sm font-semibold text-primary-600 hover:underline">
            {dict.auth.loginLink}
          </Link>
        </div>
      </div>
    );
  }

  if (profile.role !== 'admin' && profile.role !== 'super_admin') redirect(`/${locale}/dashboard`);

  return (
    <div className="flex">
      <AdminSidebar locale={locale} dict={dict} />
      <div className="min-h-screen flex-1 bg-surface-50">
        <Topbar locale={locale} title={dict.adminNav.overview} fullName={profile.full_name} roleLabel={dict.admin.roleAdmin} />
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
