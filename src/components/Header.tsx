import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-serif font-bold text-[#2A5654]">
            <div className="flex items-center space-x-2">
              <img 
                src="https://i.postimg.cc/VkVFzhxB/facebook-logo.png" 
                alt="SwarYoga Logo" 
                className="h-8 w-auto"
              />
              <span>SwarYoga</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-green-600 transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-green-600 transition-colors">
              About
            </Link>
            <Link to="/workshops" className="text-gray-700 hover:text-green-600 transition-colors">
              Workshops
            </Link>
            <Link to="/resort" className="text-gray-700 hover:text-green-600 transition-colors">
              Resort
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-green-600 transition-colors">
              Contact
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-green-600 transition-colors">
              Blog
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/cart"
              className="text-red-600 hover:text-red-700 transition-colors relative"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">3</span>
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/lifeplanner"
                  className="text-gray-700 hover:text-green-600 transition-colors"
                >
                  Life Planner
                </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    aria-label="Life Planner"
                  >
                    Sign Out
                  </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="text-gray-700 hover:text-green-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-green-600 transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-green-600 transition-colors">
                About
              </Link>
              <Link to="/workshops" className="text-gray-700 hover:text-green-600 transition-colors">
                Workshops
              </Link>
              <Link to="/resort" className="text-gray-700 hover:text-green-600 transition-colors">
                Resort
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-green-600 transition-colors">
                Contact
              </Link>
              <Link to="/blog" className="text-gray-700 hover:text-green-600 transition-colors">
                Blog
              </Link>
              <Link
                to="/cart"
                className="text-red-600 hover:text-red-700 transition-colors relative"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">3</span>
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/lifeplanner"
                      className="text-gray-700 hover:text-green-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  <Link
                    to="/lifeplanner-login"
                    className="text-gray-700 hover:text-green-600 transition-colors"
                    aria-label="Life Planner Login"
                  >
                    Life Planner Login
                  </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-center"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      className="text-gray-700 hover:text-green-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;