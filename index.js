const { Plugin } = require('powercord/entities');
const { React, getModule, channels : { getChannelId } } = require('powercord/webpack');
const { findInReactTree } = require('powercord/util');
const { inject, uninject } = require('powercord/injector');

const RecordButton = require('./components/RecordButton');

module.exports = class MicCapture extends Plugin {
  async startPlugin () {
    this.createMediaRecorder();
    this.inject();
  }

  async createMediaRecorder () {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    this.mediaRecorder = new MediaRecorder(stream);
    this.mediaRecorder.addEventListener('dataavailable', this.onRecordingReady);
  }

  inject () {
    const ChannelTextAreaContainer = getModule(m => m.type && m.type.render && m.type.render.displayName === 'ChannelTextAreaContainer', false);

    inject('record-button', ChannelTextAreaContainer.type, 'render', (args, res) => {
      const props = findInReactTree(res, r => r && r.className && r.className.indexOf('buttons-') === 0);

      props.children.unshift(
        React.createElement('div', {
          className: 'record-button',
          children: React.createElement(RecordButton),
          onClick: () => {
            if (this.mediaRecorder.state === 'inactive') {
              this.mediaRecorder.start();
            } else {
              this.mediaRecorder.stop();
            }
          }
        })
      );

      return res;
    });

    ChannelTextAreaContainer.type.render.displayName = 'ChannelTextAreaContainer';
  }

  onRecordingReady (e) {
    const { upload } = getModule([ 'cancel', 'upload' ], false);
    const file = new File([ e.data ], 'test.ogg');
    const channelID = getChannelId();

    upload(channelID, file, { content: '' });
  }

  pluginWillUnload () {
    uninject('mic-capture');
    document.querySelectorAll('record-button').forEach(e => e.style.display = 'none');
  }
};
