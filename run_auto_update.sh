#!/bin/bash

while true; do
    node autoUpdateScript.js
    echo "Script stopped, restarting in 5 seconds..."
    sleep 5
done

