import { Outlet } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      {/* Main Content */}
      <main className="flex-grow px-4 md:px-30 font-supreme lg:px-40 pt-14">
        {children || <Outlet />}
      </main>

      {/* Footer */}
    </div>
  );
};

export default Layout;
