#!/bin/bash

# Give permission for everything in the sharerecipes directory *
sudo chmod -R 777 /home/ec2-user/sharerecipes

# Navigate into our working directory where we have all our github files
cd /home/ec2-user/sharerecipes

# Add npm and node to path
export NVM_DIR="$HOME/.nvm"	
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)

nvm install --lts
nvm use --lts
nvm alias default $(node -v)

sudo ln -s ~/.nvm/versions/node/$(node -v)/bin/node /usr/bin/node
sudo ln -s ~/.nvm/versions/node/$(node -v)/bin/npm /usr/bin/npm

# Install lerna and initialize frontend packages
npm install

# cp env and run build
cd /home/ec2-user/sharerecipes/packages/frontend
cp example-front.env .env.production.local