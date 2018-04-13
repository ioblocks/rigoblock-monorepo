import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import Vault from './Vault.jsx'

describe('Vault page', () => {
  it('renders correctly', () => {
    expect(toJson(shallow(<Vault />))).toMatchSnapshot()
  })
})
