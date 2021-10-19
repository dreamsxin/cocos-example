const views = require('./scripts/views');

module.exports = (app) =>
{
	app.post('/login_auth', (req, res) => { views.LoginAuth(req, res); });
}
