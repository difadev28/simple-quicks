import React from 'react';
import { Outlet } from 'react-router-dom';
import { QuickActionTabs } from '../components/common/QuickActionTabs';

const AppLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-100 flex justify-center items-start pt-0 sm:pt-4 pb-0 sm:pb-4 font-sans antialiased text-slate-900 selection:bg-purple-500 selection:text-white">
            {/* Mobile App Container */}
            <div className="w-full max-w-md h-[100dvh] sm:h-[90vh] bg-white sm:rounded-3xl shadow-2xl relative overflow-hidden flex flex-col ring-1 ring-slate-900/5">

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth pb-20">
                    <Outlet />
                </main>

                {/* Logic Floating Tabs */}
                <QuickActionTabs />
            </div>
        </div>
    );
};

export default AppLayout;
