const cors = require('cors');


const whitelist = ['http://localhost:5000', 'http://127.0.0.1:8080', 'http://localhost:3000', 'http://127.0.0.1:3000', 'https://devandscorp.github.io'];
const corsOptionsDelegate = (req, callback) => {
  let corsOptions;

  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
