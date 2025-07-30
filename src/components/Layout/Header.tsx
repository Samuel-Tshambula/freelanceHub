import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { 
  Menu, 
  X, 
  Bell, 
  User, 
  LogOut, 
  Settings,
  Briefcase,
  Users,
  BarChart3,
  DollarSign
} from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();
  const { notifications } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getMenuItems = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'agent':
        return [
          { key: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
          { key: 'tasks', label: 'Tâches disponibles', icon: Briefcase },
          { key: 'my-applications', label: 'Mes candidatures', icon: Users },
          { key: 'payment-history', label: 'Mes paiements', icon: DollarSign },
          { key: 'profile', label: 'Mon profil', icon: User },
        ];
      case 'enterprise':
        return [
          { key: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
          { key: 'my-tasks', label: 'Mes tâches', icon: Briefcase },
          { key: 'post-task', label: 'Publier une tâche', icon: Users },
          { key: 'payment-history', label: 'Historique paiements', icon: DollarSign },
          { key: 'profile', label: 'Mon profil', icon: User },
        ];
      case 'admin':
        return [
          { key: 'dashboard', label: 'Administration', icon: BarChart3 },
          { key: 'tasks', label: 'Toutes les tâches', icon: Briefcase },
          { key: 'users', label: 'Utilisateurs', icon: Users },
          { key: 'reports', label: 'Rapports', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <header className="bg-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl lg:text-2xl font-bold text-blue-600">FreelanceLink</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => setCurrentPage(item.key)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      currentPage === item.key
                        ? 'text-blue-600 bg-blue-50 shadow-sm'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden xl:block">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {user ? (
              <>
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
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
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

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
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

        {/* Mobile menu */}
        {isMenuOpen && user && (
          <div className="lg:hidden py-4 border-t bg-gray-50">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setCurrentPage(item.key);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-left transition-all duration-200 mx-2 ${
                      currentPage === item.key
                        ? 'text-blue-600 bg-white shadow-sm border border-blue-100'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;