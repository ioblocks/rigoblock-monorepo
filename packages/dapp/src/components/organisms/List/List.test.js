import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import List from './List.jsx'

const props = {
  title: 'List Component',
  items: [
    {
      id: 1,
      name: 'Rocksolid Vault',
      symbol: 'VLT',
      value: 12489.51323
    }
  ]
}

describe('List component', () => {
  it('renders correctly', () => {
    expect(
      toJson(shallow(createComponentWithProps(List, props)))
    ).toMatchSnapshot()
  })
})