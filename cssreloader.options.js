(function () {
    var domShortcutInput, allSettings;

    function initialize() {
        document.addEventListener("DOMContentLoaded", onDomReady, false);
    }

    function handleKeys(key, isAlt, isControl, isShift) {
        if (isControl) {
            addVisualKey('Ctrl');
        }

        if (isShift) {
            addVisualKey('Shift');
        }

        if (isAlt) {
            addVisualKey('Alt');
        }

        if ( (/^U+(.*)$/.test(key) ) ) {
            var key = String.fromCharCode(key.replace('U+', '0x'));
            addVisualKey(key);
        } else {
            addVisualKey(key);
        }
    }

    function onDomReady() {
        domShortcutInput = document.querySelector('.shortcut input');
        document.querySelector('button').addEventListener("click", onButtonClicked, false);
        domShortcutInput.addEventListener("focus", onShortcutFocus, false);

        browser.runtime.sendMessage({ 'action': 'getSettings' }).then(function(settings) {
            allSettings = settings;
            handleKeys(allSettings.keyIdentifier, allSettings.altKeySelected, allSettings.controlKeySelected, allSettings.shiftKeySelected);
            document.getElementById("domain-blacklist").value = allSettings.blacklist.toString();
        });
    }

    function onShortcutFocus() {
        document.addEventListener("keydown", onDocumentKeyDown, false);
        domShortcutInput.addEventListener("blur", onShortcutBlur, false);
    }

    function onShortcutBlur() {
        document.removeEventListener("keydown", onDocumentKeyDown, false);
    }

    function addVisualKey(key) {
        var domShortcutKeys = document.querySelector('.shortcut .keys');
        var domKeys = document.querySelectorAll('.shortcut .keys div');

        var domNewContainer = document.createElement("div");
        var domNewKbd = document.createElement("kbd");
        domNewKbd.textContent = key;
        
        if (domKeys.length > 0) {
            domNewContainer.appendChild(document.createTextNode(' + '));
        }

        domNewContainer.appendChild(domNewKbd);
        domShortcutKeys.appendChild(domNewContainer);
    }

    function onDocumentKeyDown(e) {
        var domKeys = document.querySelector('.shortcut .keys');
        if (domKeys.hasChildNodes()) {
            while (domKeys.childNodes.length >= 1) {
                domKeys.removeChild(domKeys.firstChild);
            }
        }

        allSettings = {
            "keyIdentifier"      : e.key,
            "altKeySelected"     : e.altKey,
            "controlKeySelected" : e.ctrlKey,
            "shiftKeySelected"   : e.shiftKey
        };

        handleKeys(e.key, e.altKey, e.ctrlKey, e.shiftKey);
    }

    //gets the list of domains from the textarea, formats into a proper array
    function getBlacklistDomains() {
      var domainElement = document.getElementById("domain-blacklist");
      var domains = domainElement.value.trim();
      if (domains.length > 0) {
        domains = domains.split(",");
      }

      return domains;
    }

    // Saves options to localStorage.
    function onButtonClicked() {
        allSettings.blacklist = getBlacklistDomains();
        browser.runtime.sendMessage({'action' : 'saveSettings', 'data' : allSettings});

        // Update status to let user know options were saved.
        var status = document.querySelector('.status');
        status.innerHTML = "Options Saved...";
        
        setTimeout(function() {
          status.innerHTML = "";
        }, 1500);

    }

    initialize();

})();
