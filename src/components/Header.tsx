import { Moon, Sun, Upload, BarChart3 } from 'lucide-react';

interface HeaderProps {
  currentPage: 'import' | 'dashboard';
  onNavigate: (page: 'import' | 'dashboard') => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Header({ currentPage, onNavigate, isDark, onToggleTheme }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Product Manager
            </h1>
            <nav className="hidden sm:flex space-x-4">
              <button
                onClick={() => onNavigate('import')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === 'import'
                    ? 'bg-[#0B3D91] text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Upload size={18} />
                <span>Import</span>
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === 'dashboard'
                    ? 'bg-[#0B3D91] text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <BarChart3 size={18} />
                <span>Dashboard</span>
              </button>
            </nav>
          </div>
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-700" />}
          </button>
        </div>
        <nav className="flex sm:hidden space-x-2 mt-4">
          <button
            onClick={() => onNavigate('import')}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
              currentPage === 'import'
                ? 'bg-[#0B3D91] text-white shadow-md'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Upload size={16} />
            <span className="text-sm">Import</span>
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
              currentPage === 'dashboard'
                ? 'bg-[#0B3D91] text-white shadow-md'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <BarChart3 size={16} />
            <span className="text-sm">Dashboard</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
