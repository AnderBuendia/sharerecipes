#!/bin/bash
# Stopping existing node servers
echo "Stopping any existing node server"
if pgrep -l node
    then
    pkill node
    echo "Ready"
fi