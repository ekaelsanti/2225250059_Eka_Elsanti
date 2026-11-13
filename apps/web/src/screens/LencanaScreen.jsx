// Halaman Lencanaku (dibuka dari kartu menu di beranda).
import { BadgeShelf } from '../components/Badges.jsx';
import { Page } from '../components/Layout.jsx';

export default function LencanaScreen() {
  return (
    <Page title="Lencanaku" subtitle="Kumpulkan lencana dengan terus berlatih" back="/">
      <BadgeShelf />
    </Page>
  );
}
