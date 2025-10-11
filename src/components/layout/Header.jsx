import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { FaGavel, FaPlus, FaHome, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo with Icon */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
              <FaGavel className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">AuctionApp</h1>
              <p className="text-xs text-gray-500">Lelang Online Terpercaya</p>
            </div>
          </Link>

          {/* Navigation */}
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors rounded-lg hover:bg-primary-50"
              >
                <FaHome />
                <span className="hidden md:inline">Beranda</span>
              </Link>
              
              <Link
                to="/auction/create"
                className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-5 py-2.5 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all"
              >
                <FaPlus />
                <span className="hidden md:inline">Buat Lelang</span>
              </Link>

              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                <div className="relative">
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-10 h-10 rounded-full ring-2 ring-primary-500 ring-offset-2"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors"
                >
                  <FaSignOutAlt />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="px-6 py-2.5 text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;