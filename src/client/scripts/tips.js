import localforage from 'localforage';
import { confirm } from 'ample-alerts';

export const showTipOnPresentationStart = action => {
    localforage
        .getItem('showTipOnPresentationStart')
        .then(value => {
            if (value !== false) {
                confirm(
                    'Would you like to learn about the basics?',
                    {
                        onAction: r1 => {
                            if (r1) {
                                action();
                            } else {
                                confirm(
                                    'Do you want to be prompted for help the next time?',
                                    {
                                        onAction: r2 => {
                                            if (!r2) {
                                                localforage
                                                    .setItem('showTipOnPresentationStart', false);
                                            }
                                        },
                                        labels: [
                                            'Show next time',
                                            'Don\'t show next time'
                                        ]
                                    }
                                );
                            }
                        },
                        labels: [
                            'Sure!',
                            'Not now'
                        ]
                    }
                );
            }
        });
};

export default {
    showTipOnPresentationStart
};
