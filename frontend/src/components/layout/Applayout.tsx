import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';


interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Fixed */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-full">
        {/* Header - Fixed */}
        <Navbar />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100 p-2 relative  ">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};



export default AppLayout;