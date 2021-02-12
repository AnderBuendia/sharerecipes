#!/bin/bash
# Stopping existing node servers
echo "Stopping any existing node server"

pm2 kill
pm2 delete all
killall node

echo "Ready"