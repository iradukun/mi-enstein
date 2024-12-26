#!/bin/bash

LOG_FILE="auto_update.log"

echo "Starting auto-update script at $(date)" >> "$LOG_FILE"

while true; do
    echo "Running Node.js script at $(date)" >> "$LOG_FILE"
    node autoUpdateScript.js 2>&1 | tee -a "$LOG_FILE"
    
    if [ $? -ne 0 ]; then
        echo "Script exited with an error. Restarting in 5 minutes..." >> "$LOG_FILE"
        sleep 300
    else
        echo "Script completed successfully. Waiting for next hour..." >> "$LOG_FILE"
        sleep 3540  # Sleep for 59 minutes (3540 seconds)
    fi
done

