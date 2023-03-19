const express = require('express');
const fs = require('fs');
const vhost = require('vhost');
const vhttps = require('vhttps');

// import each server config

const unionIoApp = require('./servers/union.io');

// create the http server that will serve all virtual hosts
const allVirtualHostsHttpServer = express();

// add virtualhost to the vhost server
allVirtualHostsHttpServer.use(vhost('localhost', unionIoApp)); // for local dev
allVirtualHostsHttpServer.use(vhost('union.io', unionIoApp));

// shorthand for simple domains: do all of the above in one call
allVirtualHostsHttpServer.use(
  vhost('127.0.0.1', function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('hello from b.com!');
  })
);

// HTTPS config
const defaultCredential = {
  cert: fs.readFileSync('./symlinks/localhost-ssl/localhost.crt'),
  key: fs.readFileSync('./symlinks/localhost-ssl/localhost.decrypted.key'),
};

const credentialA = {
  hostname: 'localhost',
  cert: fs.readFileSync('./symlinks/localhost-ssl/localhost.crt'),
  key: fs.readFileSync('./symlinks/localhost-ssl/localhost.decrypted.key'),
};

const credentialB = {
  hostname: '127.0.0.1',
  // cert: fs.readFileSync('./b-cert.pem'),
  // key: fs.readFileSync('./b-key.pem'),
};

// Create the virtual HTTPS server, applied to the virtual HTTP server
const allVirtualHostsHttpsServer = vhttps.createServer(
  defaultCredential,
  [credentialA, credentialB],
  allVirtualHostsHttpServer
);

// Set servers to listen on different ports
allVirtualHostsHttpServer.listen(80);
allVirtualHostsHttpsServer.listen(443);
