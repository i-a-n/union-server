#!/bin/bash

rsync -rvp --exclude-from='.exclude-from-rsync' . union.io:/var/www/union-server
