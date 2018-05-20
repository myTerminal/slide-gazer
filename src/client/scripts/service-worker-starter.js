/* global navigator window */

import { confirm } from 'ample-alerts';

if ('serviceWorker' in navigator) {
    var isFirstTimeInstallation = !navigator.serviceWorker.controller,
        listenForWaitingServiceWorker = function (reg, callback) {
            if (!reg || isFirstTimeInstallation) {
                return null;
            }

            if (reg.waiting) {
                return callback(reg);
            }

            if (reg.installing) {
                waitForWorkerToBeInstalled(reg, callback);
            }

            reg.addEventListener('updatefound', function () {
                waitForWorkerToBeInstalled.bind(this)(reg, callback);
            });

            return null;
        },
        waitForWorkerToBeInstalled = function (reg, callback) {
            reg.installing.addEventListener('statechange', function () {
                if (this.state === 'installed') {
                    callback(reg);
                }
            });
        },
        promptUserToRefresh = function (reg) {
            confirm([
                'A new version is available!',
                'Do you want to refresh and load the latest version?'
            ], {
                onAction: function (response) {
                    if (response) {
                        reg.waiting.postMessage('skipWaiting');
                    }
                },
                labels: ['Sure', 'Later']
            });
        };

    window.addEventListener('load', function () {
        navigator.serviceWorker
            .register('sw.js').then(
                function (reg) {
                    console.log('ServiceWorker registration successful with scope: ', reg.scope);

                    listenForWaitingServiceWorker(reg, promptUserToRefresh);
                },
                function (err) {
                    console.log('ServiceWorker registration failed: ', err);
                }
            );

        navigator.serviceWorker
            .addEventListener(
                'controllerchange',
                function () {
                    window.location.reload();
                }
            );
    });
}
