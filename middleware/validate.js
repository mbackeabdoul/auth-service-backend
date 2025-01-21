// middleware/validate.js
const validateSignupData = (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;
    const errors = [];
  
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Email invalide');
    }
  
    // Validation mot de passe
    if (password && password.length < 6) {
      errors.push('Le mot de passe doit contenir au moins 6 caractères');
    }
  
    // Validation nom/prénom pour inscription complète
    if (!req.body.isQuickSignup) {
      if (!firstName || firstName.trim().length < 2) {
        errors.push('Prénom invalide');
      }
      if (!lastName || lastName.trim().length < 2) {
        errors.push('Nom invalide');
      }
    }
  
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
  
    next();
  };
  
  // Utilisation dans les routes
  app.post('/api/auth/signup', validateSignupData, async (req, res) => {
    // Votre logique d'inscription...
  });