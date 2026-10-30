import { AccountOverview } from '@/components/account/overview';
import { MY_SAMPLE_LISTINGS } from '@/lib/my-listings';

export default function AccountPage() {
  return <AccountOverview myListings={MY_SAMPLE_LISTINGS} />;
}
