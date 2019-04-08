/* global document FileReader Blob */

import React from 'react';
import showdown from 'showdown';
import localforage from 'localforage';
import FileSaver from 'file-saver';
import axios from 'axios';
import { FilePicker } from 'react-file-picker';
import { alert, prompt } from 'ample-alerts';

import { fetchSampleMarkdownFile } from '../common';

const converter = new showdown.Converter();

export default class Stage extends React.Component {
    componentDidMount() {
        const stage = document.getElementById('stage');

        stage.ondragover = this.onDragOverOnStage;
        stage.ondrop = this.onDropOnStage.bind(this);
        stage.ondragend = this.onDragEndOnStage;
    }

    onDragOverOnStage() {
        return false;
    }

    onDropOnStage(e) {
        e.preventDefault();

        this.loadFile(e.dataTransfer.files[0]);

        return false;
    }

    onDragEndOnStage() {
        return false;
    }

    loadFile(file) {
        const context = this,
            reader = new FileReader();

        reader.onload = event => {
            const presentationDom = converter.makeHtml(event.target.result);

            localforage
                .setItem('lastPresentationDom', presentationDom)
                .then(() => {
                    context.props.startPresentation(presentationDom);
                });
        };

        reader.readAsText(file);
    }

    fetchPresentationFromUrl() {
        const context = this;

        prompt(
            'Enter URL of a markdown file',
            {
                onAction: response => {
                    if (response) {
                        axios
                            .post('/load-remote-presentation', {
                                url: response
                            })
                            .then(r => {
                                const fileText = converter.makeHtml(r.data);

                                localforage
                                    .setItem('lastPresentationDom', fileText)
                                    .then(() => {
                                        context.props.startPresentation(fileText);
                                    });
                            })
                            .catch(error => {
                                alert(['Error!', error.response.data]);
                            });
                    }
                },
                defaultResponse: 'https://github.com/myTerminal/theme-looper/blob/master/README.md',
                labels: [
                    'Load',
                    'Cancel'
                ]
            }
        );
    }

    reloadLastPresentation() {
        localforage
            .getItem('lastPresentationDom')
            .then(value => {
                if (value) {
                    this.props.startPresentation(value);
                }
            });
    }

    loadSamplePresentation() {
        fetchSampleMarkdownFile()
            .then(response => {
                const presentationDom = converter.makeHtml(response.data);

                this.props.startPresentation(presentationDom);
            });
    }

    downloadSamplePresentation() {
        fetchSampleMarkdownFile()
            .then(response => {
                const blob = new Blob(
                    [response.data],
                    { type: 'text/markdown;charset=utf-8' }
                );

                FileSaver.saveAs(blob, 'sample-presentation.md');
            });
    }

    render() {
        return (
            <div
                id="stage-container"
                className={this.props.presentation.isPresentationLoaded ? 'hidden' : ''}>
                <div id="stage">
                    <h2 className="regular-text">
                        To start a presentation:
                    </h2>
                    <span className="regular-text">
                        Drop a markdown file here
                    </span>
                    <br />
                    <br />
                    <FilePicker
                        extensions={['md']}
                        onChange={file => this.loadFile(file)}
                        onError={err => document.alert(err)}>
                        <div className="control-button">
                            Pick a markdown file
                        </div>
                    </FilePicker>
                    <br />
                    <div
                        className="control-button"
                        onClick={() => this.fetchPresentationFromUrl()}>
                        Load presentation from URL (experimental)
                    </div>
                    <br />
                    <br />
                    <div
                        className={'control-button' + (!this.props.presentation.previousPresentationDataExists ? ' disabled' : '')}
                        onClick={() => this.reloadLastPresentation()}>
                        Reload the last presentation
                    </div>
                    <br />
                    <br />
                    <div
                        className="control-button"
                        onClick={() => this.loadSamplePresentation()}>
                        Load a sample presentation
                    </div>
                    <br />
                    <br />
                    <h2 className="regular-text">
                        To see what a markdown file looks like:
                    </h2>
                    <div
                        className="control-button"
                        onClick={() => this.downloadSamplePresentation()}>
                        Download a sample
                    </div>
                </div>
            </div>
        );
    }
}
