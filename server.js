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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));