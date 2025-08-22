const trialCheck = require('./middleware/trialCheck');

// protéger toutes les routes après login
app.use('/dashboard', trialCheck, require('./routes/dashboard'));
app.use('/restaurants', trialCheck, require('./routes/restaurants'));
app.use('/stock', trialCheck, require('./routes/stock'));
