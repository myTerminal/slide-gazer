/* global navigator window document */

import {
    alert,
    confirm
} from 'ample-alerts';

let pwaPrompt,
    installButton;

if ('serviceWorker' in navigator) {
    // Check if there is no service worker installed yet
    const isFirstTimeInstallation = !navigator.serviceWorker.controller;

    const listenForWaitingServiceWorker = (reg, callback) => {
        if (!reg || isFirstTimeInstallation) {
            return null;
        }

        if (reg.waiting) {
            // Call the callback so that an update can be considered
            return callback(reg);
        }

        if (reg.installing) {
            // Delay the callback until installation is complete
            waitForWorkerToBeInstalled(reg, callback);
        }

        reg.addEventListener(
            'updatefound',
            function () {
                waitForWorkerToBeInstalled.bind(this)(reg, callback);
            }
        );

        return null;
    };

    const waitForWorkerToBeInstalled = (reg, callback) => {
        reg.installing.addEventListener(
            'statechange',
            function () {
                // Once the installation is complete, call the callback
                if (this.state === 'installed') {
                    callback(reg);
                }
            }
        );
    };

    const promptUserToRefresh = reg => {
        confirm(
            [
                'A new version is available!',
                'Do you want to refresh and load the latest version?'
            ],
            {
                onAction: response => {
                    if (response) {
                        // Update to the latest version
                        reg.waiting.postMessage('skipWaiting');
                    }
                },
                labels: ['Sure', 'Later']
            }
        );
    };

    const installApp = () => {
        // Hide the 'install' button
        installButton.style.display = 'none';

        // Prompt user for installation
        pwaPrompt.prompt();

        // Wait for user to respond
        pwaPrompt.userChoice
            .then(
                choiceResult => {
                    if (choiceResult.outcome === 'accepted') {
                        // The user has agreed to install the app
                        // Nothing to do here
                    }

                    // Destroy the deferred prompt reference
                    pwaPrompt = null;
                }
            );
    };

    window.addEventListener(
        'load',
        () => {
            navigator.serviceWorker
                .register('sw.js')
                .then(
                    reg => {
                        console.log('ServiceWorker registration successful with scope: ', reg.scope);

                        listenForWaitingServiceWorker(reg, promptUserToRefresh);
                    },
                    err => {
                        console.log('ServiceWorker registration failed: ', err);
                    }
                );

            navigator.serviceWorker
                .addEventListener(
                    'controllerchange',
                    () => {
                        // Reload on update complete
                        window.location.reload();
                    }
                );
        }
    );

    window.addEventListener(
        'beforeinstallprompt',
        e => {
            // Prevent the default message for earlier versions of Chrome
            e.preventDefault();

            // Store the deferred prompt for future use
            pwaPrompt = e;

            // Retrieve the 'install' button
            installButton = document.getElementById('pwa-install');

            // Check if the button is present
            if (installButton) {
                // Unhide the button
                installButton.style.display = '';

                // Attach event on click for install
                installButton.addEventListener(
                    'click',
                    installApp
                );
            }
        }
    );

    window.addEventListener(
        'appinstalled',
        evt => {
            // The app installation is complete (or the app was already installed)
            alert(
                'The app has been installed!',
                {
                    autoClose: 5000
                }
            );
        }
    );
}
