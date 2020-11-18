const { React, getModule } = require('powercord/webpack');
const { Tooltip, Icon, Button } = require('powercord/components');

const buttonClasses = getModule([ 'button' ], false);
const buttonWrapperClasses = getModule([ 'buttonWrapper', 'pulseButton' ], false);
const buttonTextAreaClasses = getModule([ 'button', 'textArea' ], false);

module.exports = () =>
  <Tooltip color='black' position='top' text='Record Audio'>
    <Button className='record-button' look={Button.Looks.BLANK} size={Button.Sizes.ICON}>
      <div className={`${buttonClasses.contents} ${buttonWrapperClasses.button} ${buttonTextAreaClasses.button}`}>
        <Icon className={buttonWrapperClasses.icon} name="Microphone"></Icon>
      </div>
    </Button>;
  </Tooltip>;
