// Backend Authentication Module - Main Export File

const authRoutes = require('./routes');
const authMiddleware = require('./middlewares/auth-middleware');
const authService = require('./services/auth-service');
const userRepository = require('./repositories/user-repository');

module.exports = {
  authRoutes,
  authMiddleware,
  authService,
  userRepository,
};
