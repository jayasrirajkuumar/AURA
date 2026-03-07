import React from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  BarChart3,
  MessageSquare,
  Brain,
  Heart,
  Settings as SettingsIcon,
  User as UserIcon,
  Search,
  Bell,
  Moon,
  LayoutDashboard,
  Wind,
  Music,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from './hooks/AuthContext';

// Pages
import Dashboard from './pages/Dashboard';
import Conversations from './pages/Conversations';
import MoodAnalytics from './pages/MoodAnalytics';
import SleepQuality from './pages/SleepQuality';
import BreathingExercise from './pages/BreathingExercise';
import MusicRecommendations from './pages/MusicRecommendations';
import MoodTrackerPage from './pages/MoodTracker';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useAuth();

  if (loading) return null;

  // Protect all routes except /auth
  if (!user && location.pathname !== '/auth') {
    return <Navigate to="/auth" />;
  }

  // If logged in and on /auth, go to dashboard
  if (user && location.pathname === '/auth') {
    return <Navigate to="/" />;
  }

  // Sidebar-less layout for Auth
  if (location.pathname === '/auth') {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-brand-cream text-brand-brown font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[280px] bg-brand-off-white flex flex-col h-full border-r border-brand-grey/50">
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="bg-brand-sage p-2 rounded-xl text-white">
              <Brain size={24} />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-brand-brown">AURA</h2>
          </motion.div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={location.pathname === '/'}
            onClick={() => navigate('/')}
          />
          <SidebarItem
            icon={MessageSquare}
            label="Conversations"
            active={location.pathname === '/conversations'}
            onClick={() => navigate('/conversations')}
          />
          <SidebarItem
            icon={Heart}
            label="Mood Tracker"
            active={location.pathname === '/mood-tracker'}
            onClick={() => navigate('/mood-tracker')}
          />
          <SidebarItem
            icon={BarChart3}
            label="Mood Analytics"
            active={location.pathname === '/mood-analytics'}
            onClick={() => navigate('/mood-analytics')}
          />
          <SidebarItem
            icon={Moon}
            label="Sleep Quality"
            active={location.pathname === '/sleep-quality'}
            onClick={() => navigate('/sleep-quality')}
          />
          <SidebarItem
            icon={Wind}
            label="Guided Breathing"
            active={location.pathname === '/breathing'}
            onClick={() => navigate('/breathing')}
          />
          <SidebarItem
            icon={Music}
            label="Music Therapy"
            active={location.pathname === '/music'}
            onClick={() => navigate('/music')}
          />
          <SidebarItem
            icon={Bell}
            label="Notifications"
            active={location.pathname === '/notifications'}
            onClick={() => navigate('/notifications')}
          />
        </nav>

        <div className="p-6 mt-auto border-t border-brand-grey/50 space-y-1">
          <SidebarItem
            icon={UserIcon}
            label="Profile"
            active={location.pathname === '/profile'}
            onClick={() => navigate('/profile')}
          />
          <SidebarItem
            icon={SettingsIcon}
            label="Settings"
            active={location.pathname === '/settings'}
            onClick={() => navigate('/settings')}
          />
          <SidebarItem
            icon={LogOut}
            label="Sign Out"
            onClick={logout}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 px-10 flex items-center justify-between bg-transparent flex-shrink-0 z-20">
          <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/40 shadow-soft w-96">
            <Search size={18} className="text-brand-brown/40" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-brand-brown/30"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-brand-off-white px-3 py-1.5 rounded-full border border-brand-grey/50 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-brand-sage animate-pulse"></span>
              Live Support
            </div>
            <button
              onClick={() => navigate('/notifications')}
              className="p-2.5 bg-white rounded-full border border-brand-grey/50 text-brand-brown/60 hover:bg-brand-off-white transition-colors relative"
            >
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-peach rounded-full border-2 border-white"></span>
            </button>
            <div
              onClick={() => navigate('/profile')}
              className="flex items-center gap-3 bg-white/40 backdrop-blur-md border border-brand-grey/20 pl-1.5 pr-4 py-1.5 rounded-full cursor-pointer hover:bg-white/60 transition-all shadow-soft"
            >
              <div className="w-8 h-8 rounded-full bg-brand-sage overflow-hidden border-2 border-white shadow-sm">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="Profile" />
              </div>
              <span className="text-xs font-black tracking-tight text-brand-brown uppercase">{user?.name}</span>
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/mood-tracker" element={<MoodTrackerPage />} />
          <Route path="/mood-analytics" element={<MoodAnalytics />} />
          <Route path="/sleep-quality" element={<SleepQuality />} />
          <Route path="/breathing" element={<BreathingExercise />} />
          <Route path="/music" element={<MusicRecommendations />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
      flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300
      ${active
          ? 'bg-brand-cream text-brand-brown shadow-soft border border-brand-grey/30 font-bold'
          : 'text-brand-brown/50 hover:bg-brand-grey/20 hover:text-brand-brown font-medium'}
    `}>
      <Icon size={20} className={active ? 'text-brand-sage' : ''} />
      <span className="text-sm tracking-tight">{label}</span>
      {active && <motion.div layoutId="active" className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-sage" />}
    </div>
  );
}

export default App;
