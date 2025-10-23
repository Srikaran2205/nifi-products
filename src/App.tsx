import { useState } from 'react';
import { Header } from './components/Header';
import { ImportPage } from './pages/ImportPage';
import { DashboardPage } from './pages/DashboardPage';
import { useTheme } from './hooks/useTheme';

function App() {
  const [currentPage, setCurrentPage] = useState<'import' | 'dashboard'>('dashboard');
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />
      <main>
        {currentPage === 'import' ? <ImportPage /> : <DashboardPage />}
      </main>
    </div>
  );
}

export default App;
