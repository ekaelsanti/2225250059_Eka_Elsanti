import { useEffect } from 'react';
import { match, useRoute } from './app/router.js';
import { BadgeToast } from './components/Badges.jsx';
import ConfettiLayer from './components/ConfettiLayer.jsx';
import { BottomNav } from './components/Layout.jsx';
import CatatanScreen from './screens/CatatanScreen.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import LabScreen from './screens/LabScreen.jsx';
import LatihanScreen from './screens/LatihanScreen.jsx';
import LencanaScreen from './screens/LencanaScreen.jsx';
import LiterasiListScreen from './screens/LiterasiListScreen.jsx';
import LiterasiProblemScreen from './screens/LiterasiProblemScreen.jsx';
import { MateriListScreen, MateriModuleScreen } from './screens/MateriScreens.jsx';
import OnboardingScreen from './screens/OnboardingScreen.jsx';
import PengaturanScreen from './screens/PengaturanScreen.jsx';
import { useAppState } from './store/store.js';

const ROUTES = [
  ['/', () => <HomeScreen />],
  ['/materi', () => <MateriListScreen />],
  ['/materi/:id', ({ id }) => <MateriModuleScreen key={id} id={id} />],
  ['/latihan', () => <LatihanScreen />],
  ['/literasi', () => <LiterasiListScreen />],
  ['/literasi/:id', ({ id }) => <LiterasiProblemScreen key={id} id={id} />],
  ['/catatan', () => <CatatanScreen />],
  ['/lab', () => <LabScreen />],
  ['/pengaturan', () => <PengaturanScreen />],
  ['/lencana', () => <LencanaScreen />],
];

export default function App() {
  const route = useRoute();
  const { onboardingDone, settings } = useAppState();

  useEffect(() => {
    document.documentElement.dataset.font = settings.fontScale;
  }, [settings.fontScale]);

  // Menu samping (layar lebar) dapat dibuka/tutup lewat tombol ☰ di bilah judul.
  useEffect(() => {
    document.documentElement.dataset.nav = settings.navOpen === false ? 'closed' : 'open';
  }, [settings.navOpen]);

  if (!onboardingDone) return <OnboardingScreen />;

  let screen = null;
  for (const [pattern, render] of ROUTES) {
    const params = match(pattern, route);
    if (params) {
      screen = render(params);
      break;
    }
  }
  return (
    <>
      {screen ?? <HomeScreen />}
      <BottomNav route={route} />
      <ConfettiLayer />
      <BadgeToast />
    </>
  );
}
