import localforage from 'localforage';
import { confirm } from 'ample-alerts';

export const showTipOnPresentationStart = action => {
    localforage
        .getItem('showTipOnPresentationStart')
        .then(value => {
            if (value !== false) {
                confirm(
                    'Would you like to have a quick glance at the help page?',
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
                                            'Yes',
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
