// Étape 1 : Installer nodemailer
// npm install nodemailer

// Étape 2 : Configurer le service d'email
// config/email.js
const nodemailer = require('nodemailer');

const emailConfig = {
  development: {
    host: 'smtp.mailtrap.io', // Pour les tests
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    }
  },
  production: {
    service: 'Gmail', // ou autre service
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  }
};

const transporter = nodemailer.createTransport(
  emailConfig[process.env.NODE_ENV || 'development']
);

// Étape 3 : Créer le service d'envoi d'email
// services/email.service.js
// const sendTemporaryPassword = async (email, tempPassword) => {
//   try {
//     await transporter.sendMail({
//       from: '"Votre App" <noreply@votreapp.com>',
//       to: email,
//       subject: 'Votre mot de passe temporaire',
//       html: `
//         <h1>Bienvenue sur Notre App</h1>
//         <p>Voici votre mot de passe temporaire : <strong>${tempPassword}</strong></p>
//         <p>Veuillez le changer lors de votre première connexion.</p>
//       `
//     });
//   } catch (error) {
//     console.error('Erreur envoi email:', error);
//     throw new Error('Erreur lors de l\'envoi de l\'email');
//   }
// };