#!/bin/bash

# Give permission for everything in the sharerecipes directory *
sudo chmod -R 755 ~/sharerecipes

# Add npm and node to path // Install pm2

cd ~/sharerecipes
export NVM_DIR="$HOME/.nvm"	
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)

nvm install --lts
nvm use --lts
nvm alias default $(node -v)

sudo ln -s ~/.nvm/versions/node/$(node -v)/bin/node /usr/bin/node
sudo ln -s ~/.nvm/versions/node/$(node -v)/bin/npm /usr/bin/npm

npm install pm2 -g

sudo ln -s ~/.nvm/versions/node/$(node -v)/bin/npm /usr/bin/pm2

# cp env and run build
cd ~/sharerecipes/packages/frontend
cp example-front.env .env.production.local