const requireLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }
  return next();
};

const requireLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/account');
  }
  return next();
};

const requireSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https:\\${req.hostname}${req.url}`);
  }
  return next();
};

const bypassSecure = (req, res, next) => {
  next();
};

module.exports.requireLogin = requireLogin;
module.exports.requireLogout = requireLogout;

if (process.env.NODE_ENV === 'production') {
  module.exports.requireSecure = requireSecure;
} else {
  module.exports.requireSecure = bypassSecure;
}
