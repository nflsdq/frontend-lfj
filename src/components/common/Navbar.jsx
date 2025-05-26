import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { Menu, X, Search, Briefcase, User, FileText, Bot } from "lucide-react";
import authService from "../../services/auth";

const NavContainer = styled.nav`
  position: sticky;
  top: 0;
  z-index: 40;
  background-color: white;
  border-bottom: 2px solid black;
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: white;
  z-index: 50;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
`;

const NavLink = styled(motion.div)`
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 3px;
    background-color: #ff3366;
    transition: width 0.3s ease;
  }

  &.active:after,
  &:hover:after {
    width: 100%;
  }
`;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = authService.isAuthenticated();
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        setUser(authService.getUser());
      }
    };

    checkAuth();

    // Close mobile menu when location changes
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await authService.logout();
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  // Navigation links
  const navLinks = [
    { to: "/", label: "Beranda", icon: <Search className='mr-2' size={20} /> },
    {
      to: "/jobs",
      label: "Pekerjaan",
      icon: <Briefcase className='mr-2' size={20} />,
    },
    {
      to: "/profile",
      label: "Profil",
      icon: <User className='mr-2' size={20} />,
    },
    {
      to: "/cv",
      label: "CV",
      icon: <FileText className='mr-2' size={20} />,
    },
    {
      to: "/ai",
      label: "Fitur AI",
      icon: <Bot className='mr-2' size={20} />,
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <NavContainer>
      <div className='container mx-auto px-8 md:px-16'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link to='/' className='flex items-center'>
            <motion.div
              className='font-heading text-xl font-bold'
              whileHover={{ scale: 1.05 }}
            >
              <span className='text-primary'>Look</span>
              <span>For</span>
              <span className='text-accent'>Job</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-8'>
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                <NavLink
                  className={`font-medium flex items-center ${
                    isActive(link.to) ? "active text-primary" : ""
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {link.label}
                </NavLink>
              </Link>
            ))}

            {isLoggedIn ? (
              <motion.button
                onClick={handleLogout}
                className='px-4 py-2 bg-black text-white rounded-xl border-2 border-black'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Logout
              </motion.button>
            ) : (
              <Link to='/login'>
                <motion.button
                  className='px-4 py-2 bg-primary text-white rounded-xl border-2 border-black shadow-neo-sm'
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                    x: -2,
                    boxShadow: "6px 6px 0px 0px rgba(0,0,0,0.8)",
                  }}
                  whileTap={{
                    scale: 0.97,
                    y: 0,
                    x: 0,
                    boxShadow: "0px 0px 0px 0px rgba(0,0,0,0.8)",
                  }}
                >
                  Login
                </motion.button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            className='md:hidden'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <Menu size={28} />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <MobileMenu
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
          >
            <div className='flex justify-between items-center mb-8'>
              <div className='font-heading text-xl font-bold'>
                <span className='text-primary'>Look</span>
                <span>For</span>
                <span className='text-accent'>Job</span>
              </div>
              <motion.button
                onClick={() => setIsMenuOpen(false)}
                whileTap={{ scale: 0.9 }}
              >
                <X size={28} />
              </motion.button>
            </div>

            <div className='flex flex-col space-y-6'>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <motion.div
                    className={`text-lg font-medium flex items-center py-2 ${
                      isActive(link.to) ? "text-primary" : ""
                    }`}
                    whileHover={{ x: 5, color: "#FF3366" }}
                  >
                    {link.icon}
                    {link.label}
                  </motion.div>
                </Link>
              ))}

              {isLoggedIn ? (
                <motion.button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className='mt-8 w-full py-3 bg-black text-white rounded-xl border-2 border-black shadow-neo-sm'
                  whileTap={{
                    scale: 0.97,
                    y: 4,
                    boxShadow: "0px 0px 0px 0px rgba(0,0,0,0.8)",
                  }}
                >
                  Logout
                </motion.button>
              ) : (
                <Link
                  to='/login'
                  onClick={() => setIsMenuOpen(false)}
                  className='w-full'
                >
                  <motion.button
                    className='mt-8 w-full py-3 bg-primary text-white rounded-xl border-2 border-black shadow-neo-sm'
                    whileTap={{
                      scale: 0.97,
                      y: 4,
                      boxShadow: "0px 0px 0px 0px rgba(0,0,0,0.8)",
                    }}
                  >
                    Login
                  </motion.button>
                </Link>
              )}
            </div>
          </MobileMenu>
        )}
      </AnimatePresence>
    </NavContainer>
  );
};

export default Navbar;
