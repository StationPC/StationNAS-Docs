'use client';

import posthog from 'posthog-js';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { posthogHost } from '@/lib/shared';

let initialized = false;

function ensurePostHog() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return false;
  if (!initialized) {
    posthog.init(key, {
      api_host: posthogHost,
      capture_pageview: false,
      capture_pageleave: true,
    });
    initialized = true;
  }
  return true;
}

export function captureAnalytics(event: string, properties?: Record<string, unknown>) {
  if (ensurePostHog()) posthog.capture(event, properties);
}

export function Analytics({ locale }: { locale: string }) {
  const pathname = usePathname();
  useEffect(() => {
    if (!ensurePostHog()) return;
    captureAnalytics('page_view', { path: pathname, locale });
  }, [locale, pathname]);

  return null;
}
