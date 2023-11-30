# WaylandReaper
## Overview

WaylandReaper is a script designed for GNOME desktop environments running on Wayland. It allows users to forcefully terminate the currently focused window. It is confirmed to work with GNOME 45 and 45.1.

## Purpose

The WaylandReaper script is created with the intention of providing a Wayland equivalent to the functionality of `kill -9 $(xprop -id $(xdotool getwindowfocus) | grep _NET_WM_PID | cut -d " " -f 3)` specifically tailored for GNOME running on Wayland. It leverages the [window-calls-extended](https://github.com/hseliger/window-calls-extended) to gather extended window information.


### Note:
Before using WaylandReaper, make sure to install the [Window Calls Extended](https://github.com/hseliger/window-calls-extended) extension that provides extended window information.
## Prerequisites

Ensure you have the [Window Calls Extended](https://github.com/hseliger/window-calls-extended) installed from here to enable extended window information.
## Installation

To quickly download and install the script, run the following command in your terminal:

`sudo sh -c "curl -o /usr/local/bin/WaylandReaper.sh https://raw.githubusercontent.com/NastyaGrifon/WaylandReaper/main/WaylandReaper.sh && chmod +x /usr/local/bin/WaylandReaper.sh"`
## Usage
After installation, you can use WaylandReaper as a regular terminal command or assign it a Global Shortcut for quick execution.

You can run the script with the following command:

`WaylandReaper.sh`

This will terminate the process associated with the currently focused window.

## Disclaimer

Use this script responsibly. Forcefully terminating applications may result in unsaved data loss. The script is provided as-is, with no guarantees or warranties. The user assumes all risks associated with its use.
## Credits

WaylandReaper utilizes the [window-calls-extended](https://github.com/hseliger/window-calls-extended) Gnome Extension for extended window information.

Feel free to contribute or report issues on the GitHub repository.