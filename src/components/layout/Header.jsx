import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            AuctionApp
          </Link>

          {/* Navigation */}
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Beranda
              </Link>
              
              <Link
                to="/auction/create"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Buat Lelang
              </Link>

              <div className="flex items-center gap-3 ml-4 pl-4 border-l">
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-700 font-medium">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
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

export default Header;  // ← PASTIKAN INI ADA!