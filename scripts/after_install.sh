#!/bin/bash

# Give permission for everything in the sharerecipes directory *
sudo chmod -R 777 ~/sharerecipes

# Add npm and node to path // Install pm2

cd ~/sharerecipes
export NVM_DIR="$HOME/.nvm"	
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)

nvm install 15.13.0
nvm use 15.13.0
nvm alias default 15.13.0

npm install
npm install pm2 -g

# DB connection
echo DB_URL=$(aws ssm get-parameters --output text --region eu-west-3 --names DB_URL --with-decryption --query Parameters[0].Value) > ~/sharerecipes/packages/server/src/variables.env