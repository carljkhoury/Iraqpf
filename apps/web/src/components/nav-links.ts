import { searchPath } from '@/lib/catalog';

/** Primary navigation, shared by the desktop header, mobile menu and footer. */
export const NAV_LINKS = [
  { key: 'buy', href: searchPath('buy', 'residential') },
  { key: 'rent', href: searchPath('rent', 'residential') },
  { key: 'commercial', href: searchPath('rent', 'commercial') },
  { key: 'land', href: searchPath('buy', 'land') },
  { key: 'agencies', href: '/agencies' },
] as const;
