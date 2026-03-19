import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import DesignSystem from './DesignSystem';
import DeveloperPortal from './screens/DeveloperPortal';

const linkBase =
  'inline-flex items-center rounded-full px-4 py-2 text-body3 font-semibold transition';

function Nav() {
  return (
    <div className="sticky top-4 z-10 mt-4 flex justify-center">
      <div className="glass flex gap-2 rounded-full p-1">
        <Link className={`${linkBase} bg-ink-900 text-white`} to="/">
          Dev portal
        </Link>
        <Link className={`${linkBase} text-ink-700 hover:bg-ink-100`} to="/design-system">
          Design system
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<DeveloperPortal />} />
        <Route path="/design-system" element={<DesignSystem />} />
      </Routes>
    </BrowserRouter>
  );
}
