const auth = require('basic-auth');
const connect = require('connect');
const express = require('express');
const fs = require('fs');
const multer = require('multer');

// union.io
const unionIoApp = connect();
const unionIoRouter = express.Router();

// union.io/admin auth
const admin = {
  name: fs.readFileSync('./symlinks/.creds/.union-admin-name', 'utf8'),
  pass: fs.readFileSync('./symlinks/.creds/.union-admin-pass', 'utf8'),
};

unionIoRouter.all(/^\/admin\//, function (request, response, next) {
  const user = auth(request);

  if (!user || !admin.name || admin.pass !== user.pass) {
    response.set('WWW-Authenticate', 'Basic realm="example"');
    return response.status(401).send('unauthorized');
  }

  return next();
});

// union.io upload
const upload = multer({
  storage: multer.diskStorage({
    destination: './symlinks/uploads/',
    filename: function (req, file, callbackFunction) {
      /*
       * The file upload structure comes from the `multer` npm project.
       *
       * Uploaded files look like this:
       [
        {
          fieldname: 'photos',
          originalname: 'Overview (one cluster) - Alerts.png',
          encoding: '7bit',
          mimetype: 'image/png',
          destination: './symlinks/uploads/',
          filename: '60b641a9fa83947c39ac010b1d44f0ef',
          path: 'symlinks/uploads/60b641a9fa83947c39ac010b1d44f0ef',
          size: 206129
        }
       ]
      */

      const now = new Date();

      // Make a YYYYMMDD date
      const date = `${now.getFullYear()}${now.getUTCMonth() < 9 ? 0 : null}${
        now.getUTCMonth() + 1
      }${now.getDate()}`;

      // Generate a 6-digit hex hash
      const hash = [...Array(6)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join('');

      // Grab file extension with regex
      const fileExtension =
        file.originalname?.match(
          /([a-zA-Z0-9\s_\\.\-\(\):])+(\.[a-zA-Z0-9]{1,4})$/
        )[2] ?? null;

      const filename = `${date}--${hash}${fileExtension}`;

      callbackFunction(null, filename);
    },
  }),
});

unionIoRouter.post(
  '/admin/index.html',
  upload.array('photos'), // this must match the name of the form field
  function (req, res, next) {
    console.log('files', req.files);
    // req.files is array of `photos` files.
    // req.body will contain the text fields, if there were any

    return res.status(200).json({ status: 'ok' });
  }
);

// order is important here: first apply the special routes from above
unionIoApp.use(unionIoRouter);

// last should be the static site catch-all and/or redirects
unionIoApp.use('/', express.static('./symlinks/union.io'));

module.exports = unionIoApp;
