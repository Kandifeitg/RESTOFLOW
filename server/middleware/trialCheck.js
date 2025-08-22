// Middleware : Vérifie si la période d'essai gratuit est expirée
const db = require('../models/db');
const dayjs = require('dayjs');

function trialCheck(req, res, next) {
  const userId = req.session.userId;
  if (!userId) return res.redirect('/login.html');

  db.get("SELECT created_at, trial_active, subscription_end_date FROM users WHERE id = ?", [userId], (err, user) => {
    if (err || !user) return res.redirect('/login.html');

    // Si abonnement actif -> on laisse passer
    if (user.subscription_end_date && dayjs().isBefore(dayjs(user.subscription_end_date))) {
      return next();
    }

    // Si essai gratuit toujours actif
    if (user.trial_active === 1) {
      const createdAt = dayjs(user.created_at);
      const daysDiff = dayjs().diff(createdAt, 'day');

      if (daysDiff <= 7) {
        return next(); // toujours dans les 7 jours
      } else {
        // essai terminé → blocage
        return res.redirect('/abonnement.html');
      }
    }

    // Sinon → redirige abonnement
    return res.redirect('/abonnement.html');
  });
}

module.exports = trialCheck;
