// Halaman Lencanaku (dibuka dari kartu menu di beranda).
import { BadgeShelf } from '../components/Badges.jsx';
import { Page } from '../components/Layout.jsx';
import PageBanner from '../components/PageBanner.jsx';
import { PAGE_TEXT } from '../content/strings.id.js';

export default function LencanaScreen() {
  return (
    <Page title="Lencanaku" subtitle="Kumpulkan lencana dengan terus berlatih" back="/">
      <PageBanner tone="gold" illus="piala" title={PAGE_TEXT.lencana.title} text={PAGE_TEXT.lencana.text} />
      <BadgeShelf />
    </Page>
  );
}
