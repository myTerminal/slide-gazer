export const getSlidesDom = presentationData =>
    '<div class="slide">' +
    presentationData.replace(
        /<h2/g,
        '</div><div class="slide"><h2'
    ) +
    '</div>';


export const getLastSlide = title =>
    '<div class="slide last-slide">' +
    '  <h1>' + title + '</h1>' +
    '  Thanks for attending the session. Questions please...' +
    '</div>';

export const getFooter = domain =>
    '<div class="footer">' +
    '  Printed from <a href="http://' + domain + '">slide-gazer</a>' +
    '</div>';
