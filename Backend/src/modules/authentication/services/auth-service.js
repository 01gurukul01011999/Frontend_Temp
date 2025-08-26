const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const userRepository = require('../repositories/user-repository');

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'kishan';
    this.jwtExpiry = '86400'; // 24 hours
  }

  // User Registration
  async registerUser(userData) {
    try {
      const { firstName, lastName, email, password } = userData;
      
      // Check if user already exists
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Generate user ID
      const userId = Math.floor(Math.random() * 1000000);
      
      // Create user
      const user = await userRepository.createUser({
        fname: firstName,
        lname: lastName,
        id: userId,
        email,
        password: hashedPassword,
        ac_sta: 'reg',
        roll: 'seller'
      });

      // Generate JWT token
      const token = this.generateToken(user);
      
      return { token, user };
    } catch (error) {
      throw error;
    }
  }

  // User Login
  async loginUser(credentials) {
    try {
      const { email, password } = credentials;
      
      // Find user by email
      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = this.generateToken(user);
      
      return { token, user };
    } catch (error) {
      throw error;
    }
  }

  // Password Reset Request
  async requestPasswordReset(email) {
    try {
      // Check if user exists
      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate reset code
      const resetCode = Math.floor(100000 + Math.random() * 900000);
      const resetTime = new Date();

      // Store reset code
      await userRepository.createPasswordReset(email, resetCode, resetTime);

      // Send email
      await this.sendPasswordResetEmail(email, resetCode);

      return { message: 'Password reset code sent successfully', code: resetCode };
    } catch (error) {
      throw error;
    }
  }

  // Verify Reset Code
  async verifyResetCode(email, code) {
    try {
      const isValid = await userRepository.verifyResetCode(email, code);
      if (!isValid) {
        throw new Error('Invalid or expired reset code');
      }
      return { message: 'Code verified successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Update Password
  async updatePassword(email, newPassword) {
    try {
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      
      // Update user password
      await userRepository.updatePassword(email, hashedPassword);
      
      // Clear reset codes
      await userRepository.clearResetCodes(email);
      
      return { message: 'Password updated successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Update Profile
  async updateProfile(email, profileData) {
    try {
      const updatedUser = await userRepository.updateProfile(email, {
        ...profileData,
        ac_sta: 'done'
      });
      return { message: 'Profile updated successfully', user: updatedUser };
    } catch (error) {
      throw error;
    }
  }

  // Update Avatar
  async updateAvatar(userId, avatarPath) {
    try {
      const updatedUser = await userRepository.updateAvatar(userId, avatarPath);
      return { message: 'Avatar updated successfully', avatar: avatarPath };
    } catch (error) {
      throw error;
    }
  }

  // Verify JWT Token
  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Generate JWT Token
  generateToken(user) {
    return jwt.sign(
      {
        email: user.email,
        fname: user.fname,
        lname: user.lname,
        id: user.id,
      },
      this.jwtSecret,
      { expiresIn: this.jwtExpiry }
    );
  }

  // Send Password Reset Email
  async sendPasswordResetEmail(email, code) {
    try {
      // Email functionality moved to Supabase
      // const transporter = nodemailer.createTransporter({
      //   service: 'Gmail',
      //   auth: {
      //     user: process.env.EMAIL_USER,
      //     pass: process.env.EMAIL_PASS,
      //   },
      // });

      // const mailOptions = {
      //   from: process.env.EMAIL_USER,
      //   to: email,
      //   subject: 'Your Verification Code',
      //   text: `Your verification code is: ${code}`,
      // };

      // Email sending moved to Supabase
      // await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error('Failed to send email');
    }
  }

  // Get User by Token
  async getUserByToken(token) {
    try {
      const decoded = this.verifyToken(token);
      const user = await userRepository.findById(decoded.id);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();
