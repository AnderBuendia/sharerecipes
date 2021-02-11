#!/bin/bash

# Run server *
cd /home/ec2-user/sharerecipes/packages/frontend
pm2 start npm --name "front" -- start

cd ../server
pm2 start npm --name "back" -- start