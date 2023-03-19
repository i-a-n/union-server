const connect = require('connect');
const express = require('express');

// blog.union.io
const blogApp = connect();

// serve static content
blogApp.use('/', express.static('./symlinks/blog.union.io'));

module.exports = blogApp;
