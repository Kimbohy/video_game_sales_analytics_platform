import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const AppLayout = () => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-md dark:bg-gray-800">
        <div className="container flex items-center justify-between px-4 py-3 mx-auto">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setNavOpen(!navOpen)}
              className="p-2 text-gray-600 rounded-md lg:hidden dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle navigation menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {navOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
            <NavLink
              to="/"
              className="text-xl font-bold text-indigo-600 dark:text-indigo-400"
            >
              Video Game Analytics
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition-colors px-3 py-2 rounded-md ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
              end
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/games-released"
              className={({ isActive }) =>
                `transition-colors px-3 py-2 rounded-md ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              Games Analysis
            </NavLink>
            <NavLink
              to="/console-analysis"
              className={({ isActive }) =>
                `transition-colors px-3 py-2 rounded-md ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              Console Analysis
            </NavLink>
            <NavLink
              to="/genre-analysis"
              className={({ isActive }) =>
                `transition-colors px-3 py-2 rounded-md ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              Genre Analysis
            </NavLink>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {navOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 lg:hidden dark:border-gray-700"
          >
            <div className="container px-4 py-2 mx-auto">
              <nav className="flex flex-col gap-1">
                <NavLink
                  to="/"
                  onClick={() => setNavOpen(false)}
                  className={({ isActive }) =>
                    `transition-colors px-3 py-2 rounded-md ${
                      isActive
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`
                  }
                  end
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/games-released"
                  onClick={() => setNavOpen(false)}
                  className={({ isActive }) =>
                    `transition-colors px-3 py-2 rounded-md ${
                      isActive
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`
                  }
                >
                  Games Analysis
                </NavLink>
                <NavLink
                  to="/console-analysis"
                  onClick={() => setNavOpen(false)}
                  className={({ isActive }) =>
                    `transition-colors px-3 py-2 rounded-md ${
                      isActive
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`
                  }
                >
                  Console Analysis
                </NavLink>
                <NavLink
                  to="/genre-analysis"
                  onClick={() => setNavOpen(false)}
                  className={({ isActive }) =>
                    `transition-colors px-3 py-2 rounded-md ${
                      isActive
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`
                  }
                >
                  Genre Analysis
                </NavLink>
              </nav>
            </div>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-4 mt-8 text-center text-gray-500 border-t border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <div className="container px-4 mx-auto">
          <p>Video Game Sales Analytics - Data Visualization Project</p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
