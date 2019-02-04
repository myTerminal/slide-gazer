# slide-gazer

[![Code Climate](https://codeclimate.com/github/team-fluxion/slide-gazer.png)](https://codeclimate.com/github/team-fluxion/slide-gazer)
[![Coverage Status](https://img.shields.io/coveralls/team-fluxion/slide-gazer.svg)](https://coveralls.io/r/team-fluxion/slide-gazer?branch=master)  
[![Dependency Status](https://david-dm.org/team-fluxion/slide-gazer.svg)](https://david-dm.org/team-fluxion/slide-gazer)
[![devDependency Status](https://david-dm.org/team-fluxion/slide-gazer/dev-status.svg)](https://david-dm.org/team-fluxion/slide-gazer#info=devDependencies)
[![peer Dependency Status](https://david-dm.org/team-fluxion/slide-gazer/peer-status.svg)](https://david-dm.org/team-fluxion/slide-gazer#info=peerDependencies)  
[![License](https://img.shields.io/badge/LICENSE-GPL%20v3.0-blue.svg)](https://www.gnu.org/licenses/gpl.html)

A light-weight presentation tool for presenting your ideas quickly and with style!

> Based on [faded-presenter](https://github.com/myTerminal/faded-presenter)

## What is it?

*Slide Gazer* is a web application that can be used to present slide-shows written as markdown documents.

## Features

* Use any text-editor to create slide-show presentations and do it quickly by focussing only on content and not formatting
* Present from any computer, phone or tablet: all you need is a web-browser
* Choose from a range of slide-transition animations
* Select auto-transition of slides
* Focus on a few emphasized words on a slide
* Control the presentation from another device and have a bird's eye view of the presentation at the same time

## How to use

Open the URL [http://slide-gazer.teamfluxion.com](http://slide-gazer.teamfluxion.com) in a web-browser.

Choose to present a slide-show presentation or to control one that is already running.

### Presenting a slide-show

You can select a presentation to be presented in one of the following three ways:

1. Pick a markdown document from the system
2. Drop a markdown document on the page
3. Reload a previously presented slide-show

Once a presentation is started, navigate through the slides using the right and left arrow keys on the keyboard.
Use the up and down arrow keys to focus a few emphasized words on a slide and restore view back to normal respectively.

Hover on the top-menu to reveal more options like animations and slide auto-transition.

### Controlling a slide-show

While a presentation is being presented, expand the top-menu to view the URL that can be used to control the presentation from another device.

You can also scan the QR code to navigate to the URL.

Once a connection to the presentation if estabilished, use the buttons on the controller to control the presentation.

## Installation

Clone this repository with

    git clone https://github.com/team-fluxion/slide-gazer.git

To install dependencies within the directory, run

    npm install

Build the application with

    npm run build

Configure hosting information in file `configs.json`.

    {
        "origin": "/",
        "domain": "slide-gazer.teamfluxion.com",
        "web-protocol": "http",
        "web-port": "8089",
        "socket-port": "8090"
    }

Start the application with

    npm start

## To-do

* Make presentation controls more screen agnostic
* Touch gestures for mobile devices
* Implement "jump-to-slide"
* Multiple instanced presentations
* Support for less-smart web browsers
