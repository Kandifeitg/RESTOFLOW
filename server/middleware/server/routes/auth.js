const dayjs = require('dayjs');

// Dans la route register
db.run("INSERT INTO users (username, password, role, created_at, trial_active) VALUES (?, ?, ?, ?, ?)", 
  [username, hash, 'owner', dayjs().toISOString(), 1], (err) => {
    if (err) return res.status(500).send("Erreur création utilisateur");
    res.redirect('/login.html');
});
