;(function () {
  var storageKey = 'shortcutOptions'
  var defaultShortcutOptions = {
    'keyIdentifier': 'F9',
    'altKeySelected': false,
    'controlKeySelected': false,
    'shiftKeySelected': false,
    'blacklist': []
  }

  function initialize () {
    browser.contextMenus.create({'title': 'Reload CSS', 'type': 'normal', 'onclick': onContextMenuClicked})
    browser.runtime.onMessage.addListener(onExtensionMessage)
  }

  function onExtensionMessage (request, sender, callback) {
    if (request.action == 'getSettings') {
      return Promise.resolve(getSettings())
    }

    if (request.action == 'saveSettings') {
      saveSettings(request.data)
    }
  }

  function onContextMenuClicked (info, tab) {
    browser.tabs.sendMessage(tab.id, {action: 'reload'})
  }

  function saveSettings (settings) {
    if (settings) {
      localStorage[storageKey] = JSON.stringify(settings)
    }
  }

  function getSettings () {
    var storedObject = localStorage[storageKey]
    var settings

    if (storedObject) {
      settings = JSON.parse(storedObject)

      // new blacklist setting needs to be added by hand
      // if it's not in the localStorage settings
      if (! ('blacklist' in settings)) {
        settings['blacklist'] = []
        saveSettings(settings)
      }
    } else {
      // Going for default settings
      settings = defaultShortcutOptions
      saveSettings(settings)
    }

    return settings
  }

  initialize()
})()
