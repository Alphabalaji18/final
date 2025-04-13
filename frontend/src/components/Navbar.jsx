import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User, Phone, Menu } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hamburgerColor, setHamburgerColor] = useState("text-black");

  const hideUserOptions =
    location.pathname === "/" ||
    location.pathname === "/call" ||
    location.pathname === "/list";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Function to detect whether navbar background is dark or light
  const getNavbarBackgroundColor = () => {
    const navbar = document.querySelector('header');
    if (navbar) {
      const backgroundColor = window.getComputedStyle(navbar).backgroundColor;
      const rgb = backgroundColor.match(/\d+/g); // Extract RGB values
      const brightness = rgb
        ? 0.2126 * parseInt(rgb[0]) + 0.7152 * parseInt(rgb[1]) + 0.0722 * parseInt(rgb[2]) // Calculate brightness
        : 255; // Default to light if no color detected

      return brightness < 128 ? "dark" : "light"; // Dark background if brightness < 128
    }
    return "light"; // Default to light if navbar element is not found
  };

  // Dynamically update the hamburger icon color based on background color
  useEffect(() => {
    const updateHamburgerColor = () => {
      const theme = getNavbarBackgroundColor();
      if (theme === "dark") {
        setHamburgerColor("text-white"); // White color for dark backgrounds
      } else {
        setHamburgerColor("text-black"); // Black color for light backgrounds
      }
    };

    // Initial update of hamburger color
    updateHamburgerColor();

    // You can watch for changes in the background color, e.g., through theme change
    window.addEventListener('resize', updateHamburgerColor); // Adjust on window resize
    return () => window.removeEventListener('resize', updateHamburgerColor); // Cleanup
  }, []);

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left Side - Logo */}
        <div className="flex items-center">{/* Add logo or title here */}</div>

        {/* Center - Desktop Nav */}
        <div className="hidden sm:flex items-center gap-8">
          <Link to="/" className="btn btn-sm gap-2 text-base-content hover:text-primary">
            Home
          </Link>
          <Link to="/list" className="btn btn-sm gap-2 text-base-content hover:text-primary">
            <User className="size-5" />
            Listener
          </Link>
          <Link to="/call" className="btn btn-sm gap-2 text-base-content hover:text-primary">
            <Phone className="size-5" />
            Call
          </Link>
          <Link to="/home" className="btn btn-sm gap-2 text-base-content hover:text-primary">
            <MessageSquare className="size-5" />
            Chatty
          </Link>
        </div>

        {/* Right - Desktop Auth Actions */}
        <div className="hidden sm:flex items-center gap-6">
          {!hideUserOptions && (
            <>
              <Link to="/settings" className="btn btn-sm gap-2 text-base-content hover:text-primary">
                <Settings className="size-5" />
                Settings
              </Link>
              {authUser && (
                <>
                  <Link to="/profile" className="btn btn-sm gap-2 text-base-content hover:text-primary">
                    <User className="size-5" />
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="btn btn-sm gap-2 bg-red-500 text-white hover:bg-red-600"
                  >
                    <LogOut className="size-5" />
                    Logout
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="sm:hidden flex items-center gap-4">
          <button onClick={toggleMenu} className="btn btn-sm">
            <Menu className={`w-6 h-6 ${hamburgerColor} transition-colors`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-base-100 w-full p-4 absolute top-16 left-0 flex flex-col gap-4 border-t border-base-300">
          <Link to="/" className="btn btn-sm gap-2 text-base-content" onClick={toggleMenu}>
            Home
          </Link>
          <Link to="/list" className="btn btn-sm gap-2 text-base-content" onClick={toggleMenu}>
            <User className="size-5" />
            Listener
          </Link>
          <Link to="/call" className="btn btn-sm gap-2 text-base-content" onClick={toggleMenu}>
            <Phone className="size-5" />
            Call
          </Link>
          <Link to="/home" className="btn btn-sm gap-2 text-base-content" onClick={toggleMenu}>
            <MessageSquare className="size-5" />
            Chatty
          </Link>
          {authUser && (
            <>
              <Link to="/settings" className="btn btn-sm gap-2 text-base-content" onClick={toggleMenu}>
                <Settings className="size-5" />
                Settings
              </Link>
              <Link to="/profile" className="btn btn-sm gap-2 text-base-content" onClick={toggleMenu}>
                <User className="size-5" />
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
                className="btn btn-sm gap-2 bg-red-500 text-white hover:bg-red-600"
              >
                <LogOut className="size-5" />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
