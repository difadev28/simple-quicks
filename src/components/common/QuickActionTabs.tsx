import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Tab {
    id: string;
    path: string;
    label: string;
    iconSrc: string;
    color: string;
}

const TABS: Tab[] = [
    {
        id: 'chat',
        path: '/chat',
        label: 'Chat',
        iconSrc: '/logo/chat.svg',
        color: '#8785FF',
    },
    {
        id: 'task',
        path: '/task',
        label: 'Task',
        iconSrc: '/logo/task.svg',
        color: '#F8B76B',
    }
];

const DEFAULT_TAB: Tab = {
    id: 'default',
    path: '/',
    label: 'Home',
    iconSrc: '/logo/default.svg',
    color: '#2F80ED',
};

export const QuickActionTabs: React.FC = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTabId, setActiveTabId] = useState<string>('default');

    const activeTab = activeTabId === 'default'
        ? DEFAULT_TAB
        : (TABS.find(t => t.id === activeTabId) || DEFAULT_TAB);

    // Close menu when clicking outside
    const handleBackdropClick = () => {
        if (isOpen) setIsOpen(false);
    };

    const handleTabClick = (tab: Tab) => {
        // If clicking the active tab (or 'space yg kiri yg active'), go back to default
        if (activeTabId === tab.id) {
            setActiveTabId('default');
            navigate('/');
        } else {
            setActiveTabId(tab.id);
            navigate(tab.path);
        }
        setIsOpen(false);
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    // Colors
    const inactiveColor = '#E0E0E0'; // Gray

    return (
        <>
            {/* Backdrop to handle click outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={handleBackdropClick}
                    aria-label="Close quick actions"
                />
            )}

            <div className="absolute bottom-6 right-0 z-50 flex items-center justify-end">

                {/* Secondary Buttons (The List: Chat & Task) */}
                <div className={`
                    flex items-center gap-3 absolute right-[68px]
                    transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
                    ${isOpen
                        ? 'opacity-100 translate-x-0 pointer-events-auto'
                        : 'opacity-0 translate-x-8 pointer-events-none'
                    }
                `}>
                    {TABS.map((tab) => {
                        const isActive = activeTabId === tab.id;
                        return (
                            <div key={tab.id} className="relative group">
                                {/* Label Tooltip */}
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    {tab.label}
                                </span>

                                <button
                                    onClick={() => handleTabClick(tab)}
                                    className={`
                                        w-12 h-12 rounded-full flex items-center justify-center shadow-lg
                                        transition-all duration-200 overflow-hidden
                                        hover:scale-110 active:scale-95
                                    `}
                                    style={{
                                        backgroundColor: isActive ? tab.color : inactiveColor
                                    }}
                                    aria-label={tab.label}
                                >
                                    <div
                                        className="w-6 h-6"
                                        style={{
                                            maskImage: `url(${tab.iconSrc})`,
                                            maskRepeat: 'no-repeat',
                                            maskPosition: 'center',
                                            WebkitMaskImage: `url(${tab.iconSrc})`,
                                            WebkitMaskRepeat: 'no-repeat',
                                            WebkitMaskPosition: 'center',
                                            backgroundColor: isActive ? 'white' : tab.color
                                        }}
                                    />
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Main Button (Reflects Active State) */}
                <div className="relative z-50">
                    {/* Dark "Back to Default" Circle (Only visible when a specific tab is active) */}
                    {activeTabId !== 'default' && (
                        <button
                            onClick={() => {
                                setActiveTabId('default');
                                navigate('/');
                                setIsOpen(false);
                            }}
                            className="absolute z-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 left-[-15px]"
                            style={{
                                backgroundColor: '#4F4F4F', // Dark Gray
                            }}
                            aria-label="Back to Default"
                        />
                    )}

                    <button
                        onClick={toggleOpen}
                        className={`
                            relative z-10
                            w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-xl
                            text-white transition-all duration-300
                            ${isOpen ? 'rotate-[360deg]' : ''}
                        `}
                        style={{
                            backgroundColor: activeTab.color,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                        }}
                    >
                        <div
                            className="w-7 h-7 sm:w-8 sm:h-8"
                            style={{
                                maskImage: `url(${activeTab.iconSrc})`,
                                maskRepeat: 'no-repeat',
                                maskPosition: 'center',
                                WebkitMaskImage: `url(${activeTab.iconSrc})`,
                                WebkitMaskRepeat: 'no-repeat',
                                WebkitMaskPosition: 'center',
                                backgroundColor: 'white' // Always White on Main Button
                            }}
                        />
                    </button>
                </div>
            </div>
        </>
    );
};

