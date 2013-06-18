(function () {

  var storageKey = "shortcutOptions";
  var defaultShortcutOptions = {
    "keyIdentifier" :  'F9',
    "altKeySelected": false,
    "controlKeySelected" : false,
    "shiftKeySelected": false
  };

	function initialize() {
		chrome.contextMenus.create({"title": "Reload CSS", "type": "normal", "onclick": onContextMenuClicked});
	  chrome.runtime.onMessage.addListener(onExtensionRequest);
  }

  function onExtensionRequest(request, sender, callback) {
    if (request.action == 'getSettings') {
        callback(load_options());
    }
  }

	function onContextMenuClicked(info, tab) {
    chrome.tabs.sendMessage(tab.id, {action: "reload"});
	}

  function load_options() {
    var storedObject = localStorage[storageKey];
    var settings;

    if(storedObject) {
      settings = JSON.parse(storedObject);
    } else {
      // Going for default settings
      settings = defaultShortcutOptions;
      localStorage[storageKey] = JSON.stringify(settings);
    }

    return settings;
  }

	initialize();

})();





