# copy over ./package.json, index.js, ./scripts/deploy.sh, ./servers/*
# issue command: npm install
# ^ that should trigger a post-install server start
rsync -rvp --exclude-from='.exclude-from-rsync' . 143.198.108.103:/var/www/union-server
