import React from 'react';

export default class TopPanel extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className="controls-header">
                    Starting a presentation
                </div>
                <div>
                    Slide Gazer works with markdown files and makes them look like presentations.
                    <br />
                    <br />
                    In order to start a presentation, you could do one of the four things:
                    <ul>
                        <li>Drop a markdown file on presentation page</li>
                        <li>Pick a file from disk</li>
                        <li>Reload the last presentation, if any</li>
                        <li>Load a sample presentation</li>
                    </ul>
                    As soon as you do one of the above, Slide Gazer starts a presentation.
                    <br />
                    <br />
                    The sample presentation can also be downloaded so you can have a look at what a
                    markdown file looks like, in case you are new to markdown. It demonstrates
                    layout of a basic presentation including speaker notes, etc.
                </div>
                <div className="controls-header">
                    Driving presentations
                </div>
                <div>
                    Presentations can be controlled using a keyboard or using touch gestures on a
                    phone.
                    <br />
                    <br />
                    Slides can be changed using Right and Left arrow keys and on slides that have
                    emphasized text, Up and Down arrow keys toggle emphasis on those words to grab
                    attention of audience on those specific words on a slide.
                    <br />
                    <br />
                    You can also jump to a particular slide by clicking the option available within
                    the top-right set of controls. Once selected, you'll be shown a list of slide
                    titles, clicking on one will take you to that slide without having to move
                    through all slides sequentially.
                </div>
                <div className="controls-header">
                    Settings preferences
                </div>
                <div>
                    The set of controls on the top-right provide a few options to control various
                    aspects of the presentation.
                    <br />
                    <br />
                    You can change slide-transition animations, enable auto-transition or toggle
                    fullscreen.
                </div>
                <div className="controls-header">
                    Connecting to presentations from another device
                </div>
                <div>
                    Slide Gazer lets you control a presentation from another device, preferably a
                    smartphone.
                    <br />
                    <br />
                    Select the 'Link' control on the top-right to bring down a menu related to
                    controlling the presentation from another device.
                    You can either start Slide Gazer on another device and enter the presentation
                    code mentioned here, share the URL provided with the other device or scan the QR
                    code shown to obtain the URL.
                    <br />
                    <br />
                    Once a device tries to connect to the presentation, the host application is
                    asked for permission and if granted, the two are paired for the rest of the
                    session.
                </div>
                <div className="controls-header">
                    Controlling presentations
                </div>
                <div>
                    From the controller, you have controls to move between slides one at a time or
                    move to first and last slide in the presentation. There are controls for
                    emphasis and de-emphasis and there's an option to view one slide at a time to be
                    able to read the contents, mostly speaker notes in an easier manner.
                    <br />
                    <br />
                    By default, the controller is presented with a list of all slides in the
                    presentation, with some text from each slides, preferably to show speaker notes
                    when available.
                    While the 'single-slide' mode provides a better reading experience, the list
                    view allows you to jump to a slide directly by clicking on the slide title.
                </div>
                <div className="controls-header">
                    Happy Presenting!
                </div>
                <br />
                <br />
                <br />
            </React.Fragment>
        );
    }
}
