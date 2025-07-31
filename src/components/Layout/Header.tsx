import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import Avatar from '../Common/Avatar';
import { getProfileImage } from '../../utils/profileUtils';
import { 
  Bell, 
  User, 
  LogOut, 
  Settings,
  Home,
  Info,
  Phone
} from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();
  const { notifications } = useApp();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Navigation publique commune
  const publicNavItems = [
    { key: 'main-home', label: 'Accueil', icon: Home },
    { key: 'about', label: 'À propos', icon: Info },
    { key: 'contact', label: 'Contact', icon: Phone }
  ];

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl lg:text-2xl font-bold text-blue-600">FreelanceLink</h1>
            </div>
          </div>

          {/* Navigation publique */}
          <nav className="hidden lg:flex items-center space-x-1">
            {publicNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => setCurrentPage(item.key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === item.key
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {user ? (
              <>
                {/* Bouton Dashboard */}
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 'dashboard'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  Dashboard
                </button>
                
                {/* Notifications */}
                <button
                  onClick={() => setCurrentPage('notifications')}
                  className="relative p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Avatar 
                      src={getProfileImage(user)}
                      alt={user.name}
                      size="md"
                    />
                    <span className="hidden md:block text-sm font-medium truncate max-w-24">{user.name}</span>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50">
                      <button
                        onClick={() => {
                          setCurrentPage('profile');
                          setIsProfileMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Mon profil</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentPage('settings');
                          setIsProfileMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Paramètres</span>
                      </button>
                      <hr className="my-2 border-gray-200" />
                      <button
                        onClick={logout}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  )}
                </div>


              </>
            ) : (
              <button
                onClick={() => setCurrentPage('login')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Connexion
              </button>
            )}
          </div>
        </div>


      </div>
    </header>
  );
};

export default Header;