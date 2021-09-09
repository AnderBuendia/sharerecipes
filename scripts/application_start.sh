#!/bin/bash

# Run server *
/usr/bin/pm2 start "npm run start:server" --name "back"
/usr/bin/pm2 start "npm run start:frontend" --name "frontend"

# cd ~/sharerecipes/server
# /usr/bin/pm2 start /usr/bin/npm --name "back" -- start

# cd ~/sharerecipes/frontend
# /usr/bin/pm2 start ecosystem.config.js --env production

