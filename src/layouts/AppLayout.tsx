import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { ChatBubbleOvalLeftEllipsisIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

const AppLayout: React.FC = () => {
    // If we are at root /, redirect to /chat or handle it.
    // Actually routing handled in App.tsx

    return (
        <div className="min-h-screen bg-slate-100 flex justify-center items-start pt-0 sm:pt-4 pb-0 sm:pb-4 font-sans antialiased text-slate-900 selection:bg-purple-500 selection:text-white">
            {/* Mobile App Container */}
            <div className="w-full max-w-md h-[100dvh] sm:h-[90vh] bg-white sm:rounded-3xl shadow-2xl relative overflow-hidden flex flex-col ring-1 ring-slate-900/5">

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth pb-20">
                    <Outlet />
                </main>

                {/* Bottom Navigation */}
                <nav className="absolute bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-6 py-3 flex justify-around items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <NavLink
                        to="/chat"
                        className={({ isActive }) => `flex flex-col items-center gap-1 transition-all duration-300 group ${isActive ? 'text-purple-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <div className="relative">
                            <ChatBubbleOvalLeftEllipsisIcon className="w-7 h-7 group-hover:-translate-y-0.5 transition-transform duration-300" />
                            {/* Optional notification badge could go here */}
                        </div>
                        {/* <span className="text-[10px] font-bold tracking-wide">Chat</span> */}
                    </NavLink>

                    <NavLink
                        to="/task"
                        className={({ isActive }) => `flex flex-col items-center gap-1 transition-all duration-300 group ${isActive ? 'text-orange-500' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <div className="relative">
                            <ClipboardDocumentCheckIcon className="w-7 h-7 group-hover:-translate-y-0.5 transition-transform duration-300" />
                        </div>
                        {/* <span className="text-[10px] font-bold tracking-wide">Task</span> */}
                    </NavLink>
                </nav>
            </div>
        </div>
    );
};

export default AppLayout;
