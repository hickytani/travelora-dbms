import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Packages from './pages/Packages';
import PackageDetails from './pages/PackageDetails';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyBookings from './pages/MyBookings';
import BookingDetails from './pages/BookingDetails';
import BookPackage from './pages/BookPackage';
import Payment from './pages/Payment';
import Reviews from './pages/Reviews';
import AdminDashboard from './pages/AdminDashboard';
import AdminCustomers from './pages/AdminCustomers';
import AdminPackages from './pages/AdminPackages';
import AdminDestinations from './pages/AdminDestinations';
import AdminHotels from './pages/AdminHotels';
import AdminFlights from './pages/AdminFlights';
import AdminBookings from './pages/AdminBookings';
import AdminPayments from './pages/AdminPayments';
import AdminReviews from './pages/AdminReviews';
import AdminDatabase from './pages/AdminDatabase';
import AdminDbOperations from './pages/AdminDbOperations';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

function ProtectedRoute({ children, adminOnly }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/packages/:id" element={<PackageDetails />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Customer Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings/:id"
              element={
                <ProtectedRoute>
                  <BookingDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book/:packageId"
              element={
                <ProtectedRoute>
                  <BookPackage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/:bookingId"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reviews"
              element={
                <ProtectedRoute>
                  <Reviews />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/customers"
              element={
                <ProtectedRoute adminOnly>
                  <AdminCustomers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/packages"
              element={
                <ProtectedRoute adminOnly>
                  <AdminPackages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/destinations"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDestinations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/hotels"
              element={
                <ProtectedRoute adminOnly>
                  <AdminHotels />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/flights"
              element={
                <ProtectedRoute adminOnly>
                  <AdminFlights />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute adminOnly>
                  <AdminBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/payments"
              element={
                <ProtectedRoute adminOnly>
                  <AdminPayments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reviews"
              element={
                <ProtectedRoute adminOnly>
                  <AdminReviews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/database"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDatabase />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/db-operations"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDbOperations />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
