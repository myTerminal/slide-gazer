# slide-gazer

[![Code Climate](https://codeclimate.com/github/myTerminal/slide-gazer.png)](https://codeclimate.com/github/myTerminal/slide-gazer)
[![js-myterminal-style](https://img.shields.io/badge/code%20style-myterminal-blue.svg)](https://www.npmjs.com/package/eslint-config/myterminal)
[![Coverage Status](https://img.shields.io/coveralls/myTerminal/slide-gazer.svg)](https://coveralls.io/r/myTerminal/slide-gazer?branch=master)  
[![License](https://img.shields.io/badge/LICENSE-GPL%20v3.0-blue.svg)](https://www.gnu.org/licenses/gpl.html)

An online presentation tool for presenting your ideas quickly and with style!

> Based on [faded-presenter](https://github.com/myTerminal/faded-presenter)

## What is it?

The successor of [faded-presenter](https://github.com/myTerminal/faded-presenter), *Slide Gazer* is an online tool for presenting markdown documents as slide-show presentations.

## Features

* Use any text editor to create slide-show presentations and do it quickly by focussing only on content and not formatting
* Present from any device capable of running a decent web-browser
* Present markdown documents as presentations from almost anywhere on the web, including GitHub README files
* Choose from a range of slide-transition animations
* Have auto-transition of slides with an adjustable delay
* Bring the attention of your audience to a few emphasized words on a slide
* Control the presentation from another device and have a bird's eye view of the presentation at the same time
* Add speaker notes to be able to refer to some text while presenting

## How to use

Open the URL [https://slide-gazer.myterminal.me](https://slide-gazer.myterminal.me) in a web browser. Google Chrome is the recommended web-browser, but almost everything works in all major browsers.

On the home screen, you can choose to present a slide-show presentation or control one that is already running.

### Presenting a slide-show

You can select a presentation to be presented in one of the following three ways:

1. Drop a markdown document on the page
2. Pick a markdown document from the system
3. Load a markdown document from a URL (experimental)
4. Reload a previously presented slide-show
5. Load a sample presentation (if you just want to check how it works)

Once a presentation is started, navigate through the slides using the right and left arrow keys on the keyboard.
Use the up and down arrow keys to focus a few emphasized words on a slide and restore the view to normal respectively.

Use the **Preferences** button on the top-right corner to reveal more options like animations and slide auto-transition.

There are other controls to toggle fullscreen, view an index of slides, etc.

While viewed on a mobile device with a touch-screen, a bar is displayed at the bottom edge to be able to navigate through slides by swiping.

### Controlling a slide-show

While a presentation is being presented, select **Control** from the top-right corner of the screen to view the URL that can be used to control the presentation from another device.

You can also scan the QR code to navigate to the URL.

Once a connection to the presentation is established, use the buttons on the controller to control the presentation.

### Speaker notes

Creating speaker notes can be done within the same file. Just create a third level heading named `Notes` for a slide which is usually a second-level heading (except for slide 1) and the section will be treated as speaker notes for that slide. Speaker notes, as one would expect, are not visible on the slides while presenting. They are just shown to the controller for reference while controlling the presentation. Example:

    # Title

    My interesting idea

    ## Slide one

    The idea starts here

    ### Notes

    Actually, the idea is more than what it seems

    ## Slide two

    And it would also help with other things

    ### Notes

    Things are: thing-one, thing-two, thing-three

    ## Conclusion

    That's my idea, thoughts?

## Installation on a private server

Clone this repository with

    git clone https://github.com/myTerminal/slide-gazer.git

To install dependencies within the directory, run

    npm install

Build the application with

    npm run build

Configure hosting information in file `configs.json`.

    {
        "origin": "/",
        "domain": "slide-gazer.myterminal.me",
        "web-port": "8089",
        "socket-port": "8090"
    }

If deploying with SSL, include certificate path in the configs and the rest will be automatically taken care of: the app will be hosted on HTTPS and it will use web-sockets over SSL.

    {
        "origin": "/",
        "domain": "slide-gazer.myterminal.me",
        "web-port": "8089",
        "socket-port": "8090",
        "ssl-cert-path": "/etc/letsencrypt/live/myterminal.me"
    }

Start the application with

    npm start

## To-do

* Support for less-smart web browsers
* Import presentation files directly from [organism](https://github.com/myTerminal/organism)
