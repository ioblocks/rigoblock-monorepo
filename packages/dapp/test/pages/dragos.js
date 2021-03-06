const dragosRoute = '/dragos'

let I

module.exports = {
  _init() {
    I = require('../steps')()
  },

  navigateTo() {
    I.navigateToUrl('/dragos')
  },

  assertImOnPage() {
    I.waitInUrl('/dragos', 5)
    I.waitForText('Dragos', 5, 'div.page-main-content h1')
    I.waitForVisible('div.account-view', 5)
    I.waitForVisible('div.navigation-view', 5)
    I.waitForVisible(`a[href='${dragosRoute}'].active`, 5)
  }
}
