const sendTemporaryPassword = async (email, tempPassword) => {
      try {
        await transporter.sendMail({
          from: '"Votre App" <noreply@votreapp.com>',
          to: email,
          subject: 'Votre mot de passe temporaire',
          html: `
            <h1>Bienvenue sur Notre App</h1>
            <p>Voici votre mot de passe temporaire : <strong>${tempPassword}</strong></p>
            <p>Veuillez le changer lors de votre première connexion.</p>
          `
        });
      } catch (error) {
        console.error('Erreur envoi email:', error);
        throw new Error('Erreur lors de l\'envoi de l\'email');
      }
    };