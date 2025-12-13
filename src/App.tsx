import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import ChatList from './pages/ChatList';
import ChatDetail from './pages/ChatDetail';
import TaskPage from './pages/TaskPage';
import { ChatProvider } from './context/ChatContext';
import './App.css'; // Ensure this is imported effectively empty or handled

function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/chat" replace />} />
            <Route path="chat" element={<ChatList />} />
            <Route path="chat/:id" element={<ChatDetail />} />
            <Route path="task" element={<TaskPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/chat" replace />} />
          </Route>
        </Routes>
      </ChatProvider>
    </BrowserRouter>
  );
}

export default App;
