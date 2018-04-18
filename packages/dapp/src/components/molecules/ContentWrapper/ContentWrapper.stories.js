import React from 'react'
import { storiesOf } from '@storybook/react'
import ContentWrapper from './ContentWrapper'
import '../../_settings/_base.scss'

storiesOf('Molecules/ContentWrapper', module)
  .addDecorator(story => (
    <div style={{ minHeight: '400px', width: '400px' }}>{story()}</div>
  ))
  .add('default', () => (
    <ContentWrapper title="Content Wrapper">
      <div style={{ padding: '16px' }}>
        Bacon ipsum dolor amet boudin ball tip venison, burgdoggen pork
        prosciutto cupim ribeye meatloaf beef ribs chuck pastrami t-bone picanha
        rump. Spare ribs strip steak buffalo, beef shankle capicola short ribs
        drumstick biltong pancetta leberkas shank. Pancetta capicola boudin
        chuck. Capicola kevin t-bone brisket alcatra. Fatback shankle turducken
        cow cupim salami biltong porchetta ham.
      </div>
    </ContentWrapper>
  ))
  .add('tooltip', () => (
    <ContentWrapper title="Content Wrapper" tooltip="true">
      <div style={{ padding: '16px' }}>
        Bacon ipsum dolor amet boudin ball tip venison, burgdoggen pork
        prosciutto cupim ribeye meatloaf beef ribs chuck pastrami t-bone picanha
        rump. Spare ribs strip steak buffalo, beef shankle capicola short ribs
        drumstick biltong pancetta leberkas shank. Pancetta capicola boudin
        chuck. Capicola kevin t-bone brisket alcatra. Fatback shankle turducken
        cow cupim salami biltong porchetta ham.
      </div>
    </ContentWrapper>
  ))