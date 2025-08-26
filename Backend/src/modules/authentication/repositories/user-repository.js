const mysql = require('mysql');

class UserRepository {
  constructor() {
    // Database connection moved to Supabase
    // this.db = mysql.createPool({
    //   connectionLimit: 10,
    //   host: process.env.DB_HOST,
    //   user: process.env.DB_USER,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_NAME
    // });
  }

  // Find user by email
  async findByEmail(email) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM user WHERE email = ?";
      this.db.query(query, [email], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.length > 0 ? results[0] : null);
        }
      });
    });
  }

  // Find user by ID
  async findById(id) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM user WHERE id = ?";
      this.db.query(query, [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.length > 0 ? results[0] : null);
        }
      });
    });
  }

  // Create new user
  async createUser(userData) {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO user (fname, lname, id, email, password, ac_sta, roll) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const values = [
        userData.fname,
        userData.lname,
        userData.id,
        userData.email,
        userData.password,
        userData.ac_sta,
        userData.roll
      ];

      this.db.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve({ ...userData, insertId: result.insertId });
        }
      });
    });
  }

  // Update user profile
  async updateProfile(email, profileData) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE user SET phone = ?, address = ?, state = ?, city = ?, pincode = ?, ac_sta = ? WHERE email = ?";
      const values = [
        profileData.phone,
        profileData.address,
        profileData.state,
        profileData.city,
        profileData.pincode,
        profileData.ac_sta,
        email
      ];

      this.db.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve({ email, ...profileData });
        }
      });
    });
  }

  // Update user password
  async updatePassword(email, hashedPassword) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE user SET password = ? WHERE email = ?";
      this.db.query(query, [hashedPassword, email], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve({ email, updated: true });
        }
      });
    });
  }

  // Update user avatar
  async updateAvatar(userId, avatarPath) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE user SET avatar = ? WHERE id = ?";
      this.db.query(query, [avatarPath, userId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve({ userId, avatar: avatarPath });
        }
      });
    });
  }

  // Create password reset record
  async createPasswordReset(email, code, time) {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO reset_p (remail, rcode, time) VALUES (?, ?, ?)";
      this.db.query(query, [email, code, time], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve({ email, code, time });
        }
      });
    });
  }

  // Verify reset code
  async verifyResetCode(email, code) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM reset_p WHERE remail = ? AND rcode = ? AND time >= NOW() - INTERVAL 10 MINUTE";
      this.db.query(query, [email, code], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.length > 0);
        }
      });
    });
  }

  // Clear reset codes for an email
  async clearResetCodes(email) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM reset_p WHERE remail = ?";
      this.db.query(query, [email], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve({ email, cleared: true });
        }
      });
    });
  }

  // Test database connection
  async testConnection() {
    return new Promise((resolve, reject) => {
      this.db.getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else {
          connection.release();
          resolve(true);
        }
      });
    });
  }
}

module.exports = new UserRepository();
