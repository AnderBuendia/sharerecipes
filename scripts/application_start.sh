#!/bin/bash

# Run server *
cd ~/sharerecipes/packages/frontend
pm2 start npm --name "front" -- start

cd ~/sharerecipes/packages/server
pm2 start npm --name "back" -- start