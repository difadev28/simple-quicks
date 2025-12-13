import React from 'react';

const TaskPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">📝</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Task Management</h2>
            <p className="text-slate-500 max-w-xs">
                This feature is currently under development. Stay tuned for updates!
            </p>
        </div>
    );
};

export default TaskPage;
