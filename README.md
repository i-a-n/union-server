# union server

nodejs server for my personal projects. supports multiple domains via expressjs `vhosts`, HTTPS for them via `vhttps`, uploads via `multer` and more.

### notes

#### symlinks
a `symlinks/` directory is git ignored. it contains all the symlinks to specific paths on the machine running `union-server`. it's just a convenient way to run the server on multiple machines (like when developing) without having to deal with dotfiles or hardcoding anything.

here are the required files that must be in `./symlinks` for the server to work:

```
symlinks/
├── .creds
│   ├── .union-admin-name
│   └── .union-admin-pass
├── blog.union.io
├── blog.union.io-ssl
│   ├── fullchain.pem
│   └── privkey.pem
├── fonts.union.io
├── fonts.union.io-ssl
│   ├── fullchain.pem
│   └── privkey.pem
├── localhost-ssl
│   ├── localhost.crt
│   └── localhost.decrypted.key
├── union.io
├── union.io-ssl
│   ├── fullchain.pem
│   └── privkey.pem
└── uploads
```

#### domains
each domain should have a `${domain}.js` file in `./servers` that defines how it works, a symlink in `./symlinks` for the web root, and its SSL defined if necessary in `index.js`.

#### deploying & starting
deploys are done manually from a local machine by running the `./scripts/sync.sh` script to copy over all the relevant files, then by running `./scripts/issue-deploy-command.sh` which will trigger an `npm install` on the deploy server. installs auto-trigger a stop + restart of the server, which is a `forever` process that boils down to `node index.js` plus a watcher to restart it.

#### permissions and other odds & ends
SSL certs live in `/etc/letsencrypt/live`, and had to have their permissions relaxed since the certs are acquired via a letsencrypt bot that runs as root. the certificates should auto-renew.

by default non-root users can't open port 80 or 443. to allow any user to open any port:

```
#save configuration permanently
echo 'net.ipv4.ip_unprivileged_port_start=0' > /etc/sysctl.d/50-unprivileged-ports.conf
#apply conf
sysctl --system
```
