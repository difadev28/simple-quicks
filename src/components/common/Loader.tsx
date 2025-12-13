import React from 'react';

interface LoaderProps {
    text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ text = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full py-10">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-400 rounded-full animate-spin mb-3"></div>
            <p className="text-slate-500 text-sm font-medium animate-pulse">{text}</p>
        </div>
    );
};
