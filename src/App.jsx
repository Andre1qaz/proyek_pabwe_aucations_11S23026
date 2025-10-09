import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AuctionList from './pages/auction/AuctionList';
import AuctionDetail from './pages/auction/AuctionDetail';
import CreateAuction from './pages/auction/CreateAuction';
import EditAuction from './pages/auction/EditAuction';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<AuctionList />} />
          <Route path="/auction/:id" element={<AuctionDetail />} />
          <Route path="/auction/create" element={<CreateAuction />} />
          <Route path="/auction/edit/:id" element={<EditAuction />} />
        </Route>

        {/* Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;