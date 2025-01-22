const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('dotenv').config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch(error => console.error('Erreur MongoDB:', error));

const app = express();

app.use(cors());
app.use(express.json());

// Route authentification Google
app.post('/api/auth/google-signup', async (req, res) => {
  try {
    const { email, firstName, lastName, googleId } = req.body;
    
    let user = await User.findOne({ email });
    
    if (user) {
      user.googleId = googleId;
      if (!user.firstName) user.firstName = firstName;
      if (!user.lastName) user.lastName = lastName;
      await user.save();
    } else {
      user = new User({
        email,
        firstName,
        lastName,
        googleId,
        isGoogleAccount: true
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, message: 'Connexion Google réussie' });
  } catch (error) {
    console.error('Erreur Google auth:', error);
    res.status(400).json({ message: error.message });
  }
});

// Route pour obtenir le profil utilisateur
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Middleware d'authentification
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide" });
    }
    req.user = user;
    next();
  });
}

// Route de déconnexion (optionnelle côté serveur)
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  res.json({ message: "Déconnexion réussie" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));