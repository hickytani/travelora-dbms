import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler, authMiddleware, adminMiddleware, AuthRequest } from './middleware/auth';
import { authService } from './services/authService';
import { destinationService } from './services/destinationService';
import { packageService } from './services/packageService';
import { hotelService } from './services/hotelService';
import { flightService } from './services/flightService';
import { bookingService } from './services/bookingService';
import { paymentService } from './services/paymentService';
import { reviewService } from './services/reviewService';
import { customerService } from './services/customerService';
import { adminService } from './services/adminService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:5174'],
}));
app.use(express.json());

// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================

app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, address, passport_no } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const result = await authService.registerCustomer({
      name,
      email,
      password,
      phone,
      address,
      passport_no,
    });

    res.status(201).json({ success: true, message: 'Registration successful', data: result });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const result = await authService.loginCustomer({ email, password });
    res.json({ success: true, message: 'Login successful', data: result });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/admin-login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const result = await authService.loginAdmin({ email, password });
    res.json({ success: true, message: 'Admin login successful', data: result });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
});

app.get('/api/auth/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role === 'customer') {
      const customer = await authService.getCustomerById(req.user.id);
      res.json({ success: true, data: customer });
    } else {
      const admin = await authService.getAdminById(req.user?.id || 0);
      res.json({ success: true, data: admin });
    }
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
});

// ============================================================================
// DESTINATION ROUTES
// ============================================================================

app.get('/api/destinations', async (req: Request, res: Response) => {
  try {
    const filters = {
      city: req.query.city as string,
      country: req.query.country as string,
      climate: req.query.climate as string,
    };

    let destinations;
    if (Object.values(filters).some((v) => v)) {
      destinations = await destinationService.search(filters);
    } else {
      destinations = await destinationService.getAll();
    }

    res.json({ success: true, data: destinations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/destinations/:id', async (req: Request, res: Response) => {
  try {
    const destination = await destinationService.getById(parseInt(req.params.id));
    res.json({ success: true, data: destination });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
});

app.post('/api/destinations', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const destination = await destinationService.create(req.body);
    res.status(201).json({ success: true, message: 'Destination created', data: destination });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.put('/api/destinations/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const destination = await destinationService.update(parseInt(req.params.id), req.body);
    res.json({ success: true, message: 'Destination updated', data: destination });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.delete('/api/destinations/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const destination = await destinationService.delete(parseInt(req.params.id));
    res.json({ success: true, message: 'Destination deleted', data: destination });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============================================================================
// PACKAGE ROUTES
// ============================================================================

app.get('/api/packages', async (req: Request, res: Response) => {
  try {
    const filters = {
      title: req.query.title as string,
      category: req.query.category as string,
      destination_id: req.query.destination_id ? parseInt(req.query.destination_id as string) : undefined,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
    };

    let packages;
    if (Object.values(filters).some((v) => v)) {
      packages = await packageService.search(filters);
    } else {
      packages = await packageService.getAll();
    }

    res.json({ success: true, data: packages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/packages/:id', async (req: Request, res: Response) => {
  try {
    const pkg = await packageService.getById(parseInt(req.params.id));
    res.json({ success: true, data: pkg });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
});

app.get('/api/packages/destination/:destinationId', async (req: Request, res: Response) => {
  try {
    const packages = await packageService.getByDestination(parseInt(req.params.destinationId));
    res.json({ success: true, data: packages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/packages', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const pkg = await packageService.create({ ...req.body, admin_id: req.user?.id });
    res.status(201).json({ success: true, message: 'Package created', data: pkg });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.put('/api/packages/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const pkg = await packageService.update(parseInt(req.params.id), req.body);
    res.json({ success: true, message: 'Package updated', data: pkg });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.delete('/api/packages/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const pkg = await packageService.delete(parseInt(req.params.id));
    res.json({ success: true, message: 'Package deleted', data: pkg });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============================================================================
// HOTEL ROUTES
// ============================================================================

app.get('/api/hotels', async (req: Request, res: Response) => {
  try {
    const hotels = await hotelService.getAll();
    res.json({ success: true, data: hotels });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/hotels/:id', async (req: Request, res: Response) => {
  try {
    const hotel = await hotelService.getById(parseInt(req.params.id));
    res.json({ success: true, data: hotel });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
});

app.post('/api/hotels', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const hotel = await hotelService.create(req.body);
    res.status(201).json({ success: true, message: 'Hotel created', data: hotel });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.put('/api/hotels/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const hotel = await hotelService.update(parseInt(req.params.id), req.body);
    res.json({ success: true, message: 'Hotel updated', data: hotel });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.delete('/api/hotels/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const hotel = await hotelService.delete(parseInt(req.params.id));
    res.json({ success: true, message: 'Hotel deleted', data: hotel });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============================================================================
// FLIGHT ROUTES
// ============================================================================

app.get('/api/flights', async (req: Request, res: Response) => {
  try {
    const flights = await flightService.getAll();
    res.json({ success: true, data: flights });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/flights/:id', async (req: Request, res: Response) => {
  try {
    const flight = await flightService.getById(parseInt(req.params.id));
    res.json({ success: true, data: flight });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
});

app.post('/api/flights', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const flight = await flightService.create(req.body);
    res.status(201).json({ success: true, message: 'Flight created', data: flight });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.put('/api/flights/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const flight = await flightService.update(parseInt(req.params.id), req.body);
    res.json({ success: true, message: 'Flight updated', data: flight });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.delete('/api/flights/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const flight = await flightService.delete(parseInt(req.params.id));
    res.json({ success: true, message: 'Flight deleted', data: flight });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============================================================================
// BOOKING ROUTES
// ============================================================================

app.get('/api/bookings', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    let bookings;
    if (req.user?.role === 'admin') {
      bookings = await bookingService.getAll();
    } else {
      bookings = await bookingService.getCustomerBookings(req.user?.id || 0);
    }
    res.json({ success: true, data: bookings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/bookings/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const booking = await bookingService.getById(parseInt(req.params.id));
    res.json({ success: true, data: booking });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
});

app.post('/api/bookings', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const booking = await bookingService.create({
      ...req.body,
      customer_id: req.user?.id,
      admin_id: req.body.admin_id || 1,
      status: 'PENDING',
    });
    res.status(201).json({ success: true, message: 'Booking created', data: booking });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.put('/api/bookings/:id/cancel', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const booking = await bookingService.cancel(
      parseInt(req.params.id),
      req.user?.role === 'customer' ? req.user.id : undefined
    );
    res.json({ success: true, message: 'Booking cancelled', data: booking });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.put('/api/bookings/:id/status', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const booking = await bookingService.updateStatus(parseInt(req.params.id), req.body.status);
    res.json({ success: true, message: 'Booking status updated', data: booking });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============================================================================
// PAYMENT ROUTES
// ============================================================================

app.get('/api/payments', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const payments = await paymentService.getAll();
    res.json({ success: true, data: payments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/payments/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const payment = await paymentService.getById(parseInt(req.params.id));
    res.json({ success: true, data: payment });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
});

app.post('/api/payments', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const payment = await paymentService.create({
      booking_id: req.body.booking_id,
      amount: req.body.amount,
      payment_method: req.body.payment_method,
      payment_status: 'SUCCESS', // Simulated success
    });
    res.status(201).json({ success: true, message: 'Payment successful', data: payment });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============================================================================
// REVIEW ROUTES
// ============================================================================

app.get('/api/reviews', async (req: Request, res: Response) => {
  try {
    const reviews = await reviewService.getAll();
    res.json({ success: true, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/reviews/:id', async (req: Request, res: Response) => {
  try {
    const review = await reviewService.getById(parseInt(req.params.id));
    res.json({ success: true, data: review });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
});

app.get('/api/reviews/package/:packageId', async (req: Request, res: Response) => {
  try {
    const reviews = await reviewService.getByPackageId(parseInt(req.params.packageId));
    res.json({ success: true, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/reviews', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const review = await reviewService.create({
      customer_id: req.user?.id || 0,
      package_id: req.body.package_id,
      rating: req.body.rating,
      comment: req.body.comment,
    });
    res.status(201).json({ success: true, message: 'Review submitted', data: review });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.delete('/api/reviews/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const review = await reviewService.delete(parseInt(req.params.id));
    res.json({ success: true, message: 'Review deleted', data: review });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============================================================================
// CUSTOMER ROUTES
// ============================================================================

app.get('/api/customers', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const customers = await customerService.getAll();
    res.json({ success: true, data: customers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/customers/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const customer = await customerService.getById(parseInt(req.params.id));
    res.json({ success: true, data: customer });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
});

app.put('/api/customers/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const customer = await customerService.update(parseInt(req.params.id), req.body);
    res.json({ success: true, message: 'Customer updated', data: customer });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.delete('/api/customers/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const customer = await customerService.delete(parseInt(req.params.id));
    res.json({ success: true, message: 'Customer deleted', data: customer });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============================================================================
// ADMIN ROUTES
// ============================================================================

app.get('/api/admin/dashboard', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/admin/booking-stats', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const stats = await adminService.getBookingStats();
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/admin/popular-destinations', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const destinations = await adminService.getPopularDestinations();
    res.json({ success: true, data: destinations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/admin/top-customers', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const customers = await adminService.getTopCustomers();
    res.json({ success: true, data: customers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/admin/payment-stats', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const stats = await adminService.getPaymentStats();
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/admin/table-info', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const info = await adminService.getTableInfo();
    res.json({ success: true, data: info });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/admin/demo-queries', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const queries = await adminService.getDemoQueries();
    res.json({ success: true, data: queries });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/admin/execute-query', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await adminService.executeDemoQuery(req.body.queryName);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============================================================================
// HEALTH CHECK & ERROR HANDLING
// ============================================================================

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`\n✓ TRAVELORA Backend Server running at http://localhost:${PORT}`);
  console.log(`✓ API available at http://localhost:${PORT}/api`);
  console.log(`✓ Frontend expected at http://localhost:5173\n`);
});
