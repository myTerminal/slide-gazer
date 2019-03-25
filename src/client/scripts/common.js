import Promise from 'bluebird';
import axios from 'axios';

import packageDetails from '../../../package.json';

export const getFirstSlide = title => `
    <div class="slide first-slide">
      <div class="slide-contents">
        <h1>${title}</h1>
        <span class="credit">on Slide Gazer ${packageDetails.version}</span>
        <br />
        <br />
        Press <span class="fa fa-arrow-right"></span> to start
      </div>
    </div>`;

export const getSlidesDom = presentationData => `
    <div class="slide">
      ${presentationData.replace(/<h2/g, '</div><div class="slide"><h2')}
    </div>`;

export const getLastSlide = title => `
    <div class="slide last-slide">
      <h1>${title}</h1>
      Thanks for attending the session. Questions please...
    </div>`;

export const getFooter = (protocol, domain) => `
    <div class="footer">
      Printed from <a href="${protocol}://${domain}">slide-gazer</a>
    </div>`;

export const markSlidesForNotes = slides => {
    slides
        .querySelectorAll('.slide')
        .forEach(s => {
            if (s.querySelector('[id^=notes]')) {
                s.className += ' with-notes';
            } else {
                s.className += ' without-notes';
            }
        });
};

export const mutateImageSources = domString =>
    domString.replace(/src=/g, 'src_=');

export const unmutateImageSources = images => {
    for (let i = 0; i < images.length; i += 1) {
        const img = images[i];

        img.setAttribute('src', img.getAttribute('src_'));
    }
};

export const allImagesLoaded = images => {
    const promises = [];

    for (let i = 0; i < images.length; i += 1) {
        promises.push(
            new Promise(
                resolve => {
                    images[i].onload = () => {
                        resolve();
                    };
                }
            )
        );
    }

    return Promise.all(promises);
};

export const fetchSampleMarkdownFile = () =>
    axios.get('/sample-markdown-file');

export const timers = {
    slideTransitionTimer: null
};
