#!/bin/bash

# Get the PID of the active window
active_window_pid=$(gdbus call --session --dest org.gnome.Shell --object-path /org/gnome/Shell/Extensions/WindowsExt --method org.gnome.Shell.Extensions.WindowsExt.FocusPID | awk -F"'" '{print $2}')

# Check if the PID is successfully obtained
if [ -z "$active_window_pid" ]; then
    echo "Failed to determine the PID of the active window."
    exit 1
fi

# Forcefully terminate the process using kill -9
kill -9 "$active_window_pid"
