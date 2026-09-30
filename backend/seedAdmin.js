// Run with: node seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const ADMIN = {
  username: 'atef-admin',
  email: 'ahababatef14@gmail.com',
  password: 'atef12345',
};

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[seed] connected to MongoDB');

    let user = await User.findOne({ email: ADMIN.email });

    if (user) {
      user.username = ADMIN.username;
      user.password = ADMIN.password;
      user.isAdmin = true;
      await user.save();
      console.log(`[seed] admin user UPDATED: ${ADMIN.email}`);
    } else {
      user = new User({
        username: ADMIN.username,
        email: ADMIN.email,
        password: ADMIN.password,
        isAdmin: true,
      });
      await user.save();
      console.log(`[seed] admin user CREATED: ${ADMIN.email}`);
    }

    console.log('[seed] done ✅');
    process.exit(0);
  } catch (err) {
    console.error('[seed] error:', err.message);
    process.exit(1);
  }
})();