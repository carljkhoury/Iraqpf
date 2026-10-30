'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * DEMO SIGN-IN for Phase 2. The session lives only in this browser. Phase 3
 * replaces it with real phone OTP sessions (docs/05-database.md §3); the
 * hook's shape (`user`, `signIn`, `signOut`, `update`) stays the same.
 */
export type AccountType = 'seeker' | 'owner' | 'broker';

export interface DemoUser {
  name: string;
  phone: string; // E.164
  email?: string;
  whatsapp?: string;
  accountType: AccountType;
  notifications: { messages: boolean; listingUpdates: boolean; newsletter: boolean };
  since: string;
}

const KEY = 'mahalla:demo-session';
const listeners = new Set<() => void>();
let cache: DemoUser | null | undefined;

function read(): DemoUser | null {
  if (cache !== undefined) return cache;
  try {
    cache = JSON.parse(window.localStorage.getItem(KEY) ?? 'null') as DemoUser | null;
  } catch {
    cache = null;
  }
  return cache;
}

function write(user: DemoUser | null) {
  cache = user;
  try {
    if (user) window.localStorage.setItem(KEY, JSON.stringify(user));
    else window.localStorage.removeItem(KEY);
  } catch {
    // Storage unavailable: the session lasts for this page view only.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = undefined;
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

/** `undefined` while reading storage (first client render), then the user or null. */
export function useDemoSession() {
  const user = useSyncExternalStore<DemoUser | null | undefined>(subscribe, read, () => undefined);
  const signIn = useCallback((phone: string, name: string) => {
    write({
      name,
      phone,
      accountType: 'owner',
      notifications: { messages: true, listingUpdates: true, newsletter: false },
      since: new Date().toISOString(),
    });
  }, []);
  const update = useCallback((patch: Partial<DemoUser>) => {
    const current = read();
    if (current) write({ ...current, ...patch });
  }, []);
  const signOut = useCallback(() => write(null), []);
  return { user, signIn, signOut, update };
}

/** Code accepted by the demo sign-in (no SMS is sent in Phase 2). */
export const DEMO_OTP = '123456';
