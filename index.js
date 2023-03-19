const express = require('express');
const fs = require('fs');
const vhost = require('vhost');
const vhttps = require('vhttps');

// import each server config
const unionIoApp = require('./servers/union.io');
const blogApp = require('./servers/blog.union.io');
const fontApp = require('./servers/fonts.union.io');

// create the http server that will serve all virtual hosts
const allVirtualHostsHttpServer = express();

// add virtualhost to the vhost server
allVirtualHostsHttpServer.use(vhost('localhost', unionIoApp)); // for local dev
allVirtualHostsHttpServer.use(vhost('union.io', unionIoApp));
allVirtualHostsHttpServer.use(vhost('blog.union.io', blogApp));
allVirtualHostsHttpServer.use(vhost('fonts.union.io', fontApp));

// shorthand for simple domains: do all of the above in one call
allVirtualHostsHttpServer.use(
  vhost('127.0.0.1', function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('hello from b.com!');
  })
);

// HTTPS config
const defaultCredential = {
  cert: fs.readFileSync('./symlinks/union.io-ssl/fullchain.pem'),
  key: fs.readFileSync('./symlinks/union.io-ssl/privkey.pem'),
};

const localhostCredential = {
  hostname: 'localhost',
  cert: fs.readFileSync('./symlinks/localhost-ssl/localhost.crt'),
  key: fs.readFileSync('./symlinks/localhost-ssl/localhost.decrypted.key'),
};

const unionIoCredential = {
  hostname: 'union.io',
  cert: fs.readFileSync('./symlinks/union.io-ssl/fullchain.pem'),
  key: fs.readFileSync('./symlinks/union.io-ssl/privkey.pem'),
};

const blogCredential = {
  hostname: 'blog.union.io',
  cert: fs.readFileSync('./symlinks/blog.union.io-ssl/fullchain.pem'),
  key: fs.readFileSync('./symlinks/blog.union.io-ssl/privkey.pem'),
};

const fontCredential = {
  hostname: 'fonts.union.io',
  cert: fs.readFileSync('./symlinks/fonts.union.io-ssl/fullchain.pem'),
  key: fs.readFileSync('./symlinks/fonts.union.io-ssl/privkey.pem'),
};

// Create the virtual HTTPS server, applied to the virtual HTTP server
const allVirtualHostsHttpsServer = vhttps.createServer(
  defaultCredential,
  [localhostCredential, unionIoCredential, blogCredential, fontCredential],
  allVirtualHostsHttpServer
);

// Set servers to listen on different ports
allVirtualHostsHttpServer.listen(80);
allVirtualHostsHttpsServer.listen(443);
