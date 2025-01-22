const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  googleId: String,  // Retiré l'index sparse ici car nous utiliserons schema.index()
  isGoogleAccount: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Définir l'index une seule fois ici
userSchema.index({ googleId: 1 }, { sparse: true });

const User = mongoose.model('User', userSchema);
module.exports = User;