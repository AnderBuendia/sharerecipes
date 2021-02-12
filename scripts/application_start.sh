#!/bin/bash

# Run server *
#cd ~/sharerecipes/packages/server
# pm2 start npm --name "back" -- start

cd ~/sharerecipes/packages/frontend
pm2 start ecosystem.config.js --env production

