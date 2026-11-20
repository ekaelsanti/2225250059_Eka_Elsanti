import { useEffect } from 'react';
import { match, useRoute } from './app/router.js';
import { useSession } from './app/session.js';
import GuruScreen from './screens/GuruScreen.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import { BadgeToast } from './components/Badges.jsx';
import ConfettiLayer from './components/ConfettiLayer.jsx';
import { BottomNav } from './components/Layout.jsx';
import CatatanScreen from './screens/CatatanScreen.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import LabScreen from './screens/LabScreen.jsx';
import LatihanScreen from './screens/LatihanScreen.jsx';
import LencanaScreen from './screens/LencanaScreen.jsx';
import TanyaScreen from './screens/TanyaScreen.jsx';
import LiterasiListScreen from './screens/LiterasiListScreen.jsx';
import LiterasiProblemScreen from './screens/LiterasiProblemScreen.jsx';
import { MateriListScreen, MateriModuleScreen } from './screens/MateriScreens.jsx';
import RmtLessonScreen from './features/rmt/RmtLessonScreen.jsx';
import OnboardingScreen from './screens/OnboardingScreen.jsx';
import PengaturanScreen from './screens/PengaturanScreen.jsx';
import { useAppState } from './store/store.js';

const ROUTES = [
  ['/', () => <HomeScreen />],
  ['/materi', () => <MateriListScreen />],
  ['/materi/:id', ({ id }) => <MateriModuleScreen key={id} id={id} />],
  ['/belajar/:id', ({ id }) => <RmtLessonScreen key={id} id={id} />],
  ['/latihan', () => <LatihanScreen />],
  ['/literasi', () => <LiterasiListScreen />],
  ['/literasi/:id', ({ id }) => <LiterasiProblemScreen key={id} id={id} />],
  ['/catatan', () => <CatatanScreen />],
  ['/lab', () => <LabScreen />],
  ['/pengaturan', () => <PengaturanScreen />],
  ['/lencana', () => <LencanaScreen />],
  ['/tanya', () => <TanyaScreen />],
];

export default function App() {
  const route = useRoute();
  const { onboardingDone, settings } = useAppState();
  const { role } = useSession();

  useEffect(() => {
    document.documentElement.dataset.font = settings.fontScale;
  }, [settings.fontScale]);

  // Menu samping (layar lebar) dapat dibuka/tutup lewat tombol ☰ di bilah judul.
  useEffect(() => {
    document.documentElement.dataset.nav = settings.navOpen === false ? 'closed' : 'open';
  }, [settings.navOpen]);

  // Login dulu setiap kali aplikasi dibuka (Siswa / Guru). Pengenalan hanya untuk siswa.
  if (!role) return <LoginScreen />;
  if (role === 'siswa' && !onboardingDone) return <OnboardingScreen />;

  let screen = null;
  const routes = role === 'guru' ? [['/guru', () => <GuruScreen />], ...ROUTES] : ROUTES;
  for (const [pattern, render] of routes) {
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
