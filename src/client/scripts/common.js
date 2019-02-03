import Promise from 'bluebird';
import axios from 'axios';

export const getFirstSlide = (title) =>
    ''
    + '<div class="slide first-slide">'
    + '  <div class="slide-contents">'
    + '    <h1>' + title + '</h1>'
    + '    <br />'
    + '    <span class="fa fa-arrow-right"></span> Next Slide'
    + '    <br />'
    + '    <span class="fa fa-arrow-left"></span> Previous Slide'
    + '    <br />'
    + '    <span class="fa fa-arrow-up"></span> Emphasize'
    + '    <br />'
    + '    <span class="fa fa-arrow-down"></span> De-emphasize'
    + '  </div>'
    + '</div>';

export const getSlidesDom = presentationData =>
    '<div class="slide">'
    + presentationData.replace(
        /<h2/g,
        '</div><div class="slide"><h2'
    )
    + '</div>';

export const getLastSlide = title =>
    ''
    + '<div class="slide last-slide">'
    + '  <h1>' + title + '</h1>'
    + '  Thanks for attending the session. Questions please...'
    + '</div>';

export const getFooter = (protocol, domain) =>
    ''
    + '<div class="footer">'
    + '  Printed from <a href="' + protocol + '://' + domain + '">slide-gazer</a>'
    + '</div>';

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
