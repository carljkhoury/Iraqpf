import { setRequestLocale } from 'next-intl/server';
import {
  SearchResultsPage,
  type SearchRouteProps,
  searchMetadata,
} from '@/components/search/search-results-page';

export function generateMetadata(props: SearchRouteProps) {
  return searchMetadata('buy', props);
}

export default async function Page(props: SearchRouteProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  return <SearchResultsPage purpose="buy" {...props} />;
}
