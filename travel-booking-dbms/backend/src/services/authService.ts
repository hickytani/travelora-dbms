import { query } from '../db/connection';
import { Customer, Admin, LoginRequest, RegisterRequest } from '../types';
import { hashPassword, comparePassword, generateToken } from '../utils/crypto';

export const authService = {
  // Customer Registration
  async registerCustomer(data: RegisterRequest) {
    const hashedPassword = await hashPassword(data.password);

    const result = await query(
      `INSERT INTO customer (name, email, phone, password, address, passport_no)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING customer_id, name, email, phone, address, passport_no, created_at`,
      [data.name, data.email, data.phone || null, hashedPassword, data.address || null, data.passport_no || null]
    );

    const customer = result.rows[0];
    const token = generateToken(customer.customer_id, customer.email, 'customer');

    return {
      token,
      customer: {
        id: customer.customer_id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        passport_no: customer.passport_no,
      },
    };
  },

  // Customer Login
  async loginCustomer(data: LoginRequest) {
    const result = await query('SELECT * FROM customer WHERE email = $1', [data.email]);

    if (result.rows.length === 0) {
      throw new Error('Invalid email or password');
    }

    const customer = result.rows[0];
    const isPasswordValid = await comparePassword(data.password, customer.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken(customer.customer_id, customer.email, 'customer');

    return {
      token,
      customer: {
        id: customer.customer_id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        passport_no: customer.passport_no,
      },
    };
  },

  // Admin Login
  async loginAdmin(data: LoginRequest) {
    const result = await query('SELECT * FROM admin WHERE email = $1', [data.email]);

    if (result.rows.length === 0) {
      throw new Error('Invalid email or password');
    }

    const admin = result.rows[0];
    const isPasswordValid = await comparePassword(data.password, admin.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken(admin.admin_id, admin.email, 'admin');

    return {
      token,
      admin: {
        id: admin.admin_id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    };
  },

  // Get Customer by ID
  async getCustomerById(id: number) {
    const result = await query('SELECT * FROM customer WHERE customer_id = $1', [id]);

    if (result.rows.length === 0) {
      throw new Error('Customer not found');
    }

    const customer = result.rows[0];
    return {
      id: customer.customer_id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      passport_no: customer.passport_no,
    };
  },

  // Get Admin by ID
  async getAdminById(id: number) {
    const result = await query('SELECT * FROM admin WHERE admin_id = $1', [id]);

    if (result.rows.length === 0) {
      throw new Error('Admin not found');
    }

    const admin = result.rows[0];
    return {
      id: admin.admin_id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };
  },
};
