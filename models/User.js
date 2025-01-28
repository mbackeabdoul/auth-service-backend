const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  // Assurez-vous d'installer bcryptjs

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  googleId: String,
  isGoogleAccount: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: function() { return !this.isGoogleAccount; } // Un mot de passe est requis si ce n'est pas un compte Google
  }
}, {
  timestamps: true
});

// Comparaison du mot de passe haché
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Avant de sauvegarder un utilisateur, hacher le mot de passe
userSchema.pre('save', async function(next) {
  if (!this.isGoogleAccount && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10); // Hachage du mot de passe
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
