import '../../_settings/_base.scss'
import { select, withKnobs } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'
import React from 'react'
import TextField from './TextField'

const options = {
  noError: '',
  error: 'Error state'
}

const props = {
  id: 'testTextField',
  fullWidth: false,
  size: 10,
  placeholder: 'text field',
  input: {
    onChange: () => {}
  }
}

storiesOf('Atoms/TextField', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <TextField
      {...props}
      meta={{
        error: select('State', options, options.noError),
        touched: true
      }}
    />
  ))
