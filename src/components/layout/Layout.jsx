import { Outlet } from 'react-router-dom';
import { MobileNavigation, DesktopNavigation, MobileHeader } from '../navigation';

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header (hidden on desktop) */}
      <MobileHeader />

      {/* Desktop Sidebar Navigation (hidden on mobile/tablet) */}
      <DesktopNavigation />

      {/* Main Content Area */}
      <main className="content-area pt-16 lg:pt-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation (hidden on desktop) */}
      <MobileNavigation />
    </div>
  );
};

export default Layout;
