import Link from 'next/link';
import { useAuth } from '../contexts/authContext';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navbarVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const linkVariants = {
    hover: { scale: 1.1, textShadow: "0px 0px 8px rgb(255,255,255)" }
  };

  return (
    <motion.nav 
      className="bg-gradient-to-r from-purple-900 to-indigo-800 p-4 shadow-lg"
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/" className="text-white text-3xl font-extrabold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">
                Quiz App
              </span>
            </Link>
          </motion.div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-4">
            {!user ? (
              <>
                <motion.div whileHover="hover" variants={linkVariants}>
                  <Link href="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out transform hover:-translate-y-1 hover:bg-purple-700">
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover="hover" variants={linkVariants}>
                  <Link href="/signup" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out transform hover:-translate-y-1 hover:bg-indigo-700">
                    Signup
                  </Link>
                </motion.div>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={logout}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 transition duration-300 ease-in-out"
              >
                Logout
              </motion.button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <motion.div 
            className="md:hidden mt-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {!user ? (
              <>
                <Link href="/login" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium hover:bg-purple-700">
                  Login
                </Link>
                <Link href="/signup" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700">
                  Signup
                </Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="block w-full text-left text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
