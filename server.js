const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('dotenv').config();

// Fonction de connexion à la base de données
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/service-locaux');
    console.log('Connexion à MongoDB réussie');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error);
    process.exit(1);
  }
};

// Initialisation de l'application Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base de données
connectDB();

// Route pour l'inscription rapide
app.post('/api/auth/quick-signup', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const password = Math.random().toString(36).slice(-8); // Génère un mot de passe aléatoire

    const user = new User({
      email,
      password,
      isQuickSignup: true
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'votre_secret_jwt', 
      { expiresIn: '1h' }
    );
    
    // En production, envoyez le mot de passe par email
    res.json({ 
      token, 
      password,
      message: 'Inscription rapide réussie'
    }); 
  } catch (error) {
    console.error('Erreur inscription rapide:', error);
    res.status(400).json({ message: error.message });
  }
});

// Route pour l'inscription complète
app.post('/api/auth/google-signup', async (req, res) => {
    try {
      const { email, firstName, lastName, googleId } = req.body;
      
      // Vérifier si l'utilisateur existe déjà
      let user = await User.findOne({ email });
      
      if (user) {
        // Si l'utilisateur existe, mettre à jour ses informations Google
        user.googleId = googleId;
        if (!user.firstName) user.firstName = firstName;
        if (!user.lastName) user.lastName = lastName;
        await user.save();
      } else {
        // Créer un nouvel utilisateur
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
        process.env.JWT_SECRET || 'votre_secret_jwt',
        { expiresIn: '1h' }
      );
  
      res.json({
        token,
        message: 'Connexion avec Google réussie'
      });
    } catch (error) {
      console.error('Erreur connexion Google:', error);
      res.status(400).json({ message: error.message });
    }
  });

// Route de test pour vérifier que le serveur fonctionne
app.get('/api/test', (req, res) => {
  res.json({ message: 'Le serveur fonctionne correctement' });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));