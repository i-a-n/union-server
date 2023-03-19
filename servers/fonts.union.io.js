const connect = require('connect');
const express = require('express');

// fonts.union.io
const fontApp = connect();

// serve static content
fontApp.use('/', express.static('./symlinks/fonts.union.io'));

module.exports = fontApp;
