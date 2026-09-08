import bcrypt from 'bcrypt';
import userRepository from '../repositories/userRepository.js';
import otpRepository from '../repositories/otpRepository.js';
import { signToken } from '../utils/jwt.js';
import crypto from 'crypto';

class AuthService {
  async register(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const token = signToken({ id: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      token,
    };
  }

  async login(credentials) {
    const user = await userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordCorrect) {
      throw new Error('Invalid email or password');
    }

    const token = signToken({ id: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      token,
    };
  }

  async sendOtp(phone) {
    // Generate 6-digit random OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();

    // Expiry: 5 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    await otpRepository.saveOtp(phone, otpCode, expiresAt);

    // Return OTP in development mode
    if (process.env.NODE_ENV !== 'production') {
      return {
        success: true,
        message: 'OTP sent successfully',
        otp: otpCode,
      };
    }

    return {
      success: true,
      message: 'OTP sent successfully',
    };
  }

  async verifyOtp(phone, code) {
    const otpRecord = await otpRepository.findOtpByPhone(phone);

    if (!otpRecord) {
      throw new Error('No OTP request found for this phone number');
    }

    if (otpRecord.code !== code) {
      throw new Error('Invalid OTP code');
    }

    if (new Date() > otpRecord.expiresAt) {
      throw new Error('OTP has expired');
    }

    // Find or create user
    let user = await userRepository.findByPhone(phone);
    if (!user) {
      user = await userRepository.createUserByPhone(phone);
    }

    const token = signToken({ id: user.id, email: user.email });

    // Consume OTP
    await otpRepository.deleteOtp(phone);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      token,
    };
  }

  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    };
  }
}

export default new AuthService();
