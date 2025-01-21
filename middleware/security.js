const helmet = require('helmet');
app.use(helmet()); // Protection contre les vulnérabilités web courantes

// Appliquer le rate limiting aux routes d'authentification
app.use('/api/auth', authLimiter);