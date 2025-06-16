import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { navRoutes } from '@/config/routes';
import ProgressRing from '@/components/atoms/ProgressRing';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [overallProgress, setOverallProgress] = useState(45);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-warm-300 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo and Mobile Menu */}
            <div className="flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-lg hover:bg-warm-100 transition-colors"
              >
                <ApperIcon name="Menu" className="w-6 h-6 text-primary" />
              </button>
              
              <div className="flex items-center ml-2 lg:ml-0">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                  <ApperIcon name="Sprout" className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-display text-primary">SkillHatch</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navRoutes.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-elevation'
                        : 'text-primary hover:bg-warm-100 hover:scale-102'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} className="w-4 h-4" />
                  <span className="text-sm font-medium">{route.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Progress Indicator */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-sm text-gray-600">Overall Progress</span>
                <ProgressRing size={32} progress={overallProgress} />
              </div>
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isMobileMenuOpen ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed left-0 top-0 h-full w-64 bg-white shadow-float z-50 lg:hidden"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="Sprout" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-display text-primary">SkillHatch</h1>
            </div>
            <button
              onClick={toggleMobileMenu}
              className="p-1 rounded-lg hover:bg-warm-100"
            >
              <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <nav className="space-y-2">
            {navRoutes.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-warm-100'
                  }`
                }
              >
                <ApperIcon name={route.icon} className="w-5 h-5" />
                <span className="font-medium">{route.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 p-4 bg-warm-100 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <ProgressRing size={40} progress={overallProgress} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;