(function () {
  var domShortcutInput;
  var storageKey = "shortcutOptions";
  
  function initialize() {
    document.addEventListener("DOMContentLoaded", onDomReady, false);
  }

  function handleKeys(keyIdentifier, isAlt, isControl, isShift) {
    keyIdentifier = keyIdentifier.replace('U+', '');
    if (isControl) {
      addVisualKey('Ctrl');
    }

    if (isShift) {
      addVisualKey('Shift');
    }

    if (isAlt) {
      addVisualKey('Alt');
    }

    if ((/^[A-F\d]{4}$/.test(keyIdentifier))) {
      var key = eval('"\\u' + keyIdentifier + '"');
      addVisualKey(key);
    } else {
      addVisualKey(keyIdentifier);
    }
  }

  function onDomReady() {
    domShortcutInput = document.querySelector('.shortcut input');
    document.querySelector('button').addEventListener("click", onButtonClicked, false);
    domShortcutInput.addEventListener("focus", onShortcutFocus, false);

    restore_options();
  }

  function onShortcutFocus() {
    document.addEventListener("keypress", onDocumentKeyDown, false);
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
    domNewKbd.innerHTML = key;
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

    handleKeys(e.keyIdentifier, e.altKey, e.ctrlKey, e.shiftKey);
  }

  // Saves options to localStorage.
  function onButtonClicked() {
    var shortcutOptions = {
      "keyIdentifier" :  shortcutKeyIdentifier,
      "altKeySelected": altKeySelected,
      "controlKeySelected" : controlKeySelected,
      "shiftKeySelected": shiftKeySelected
    };

    localStorage[storageKey] = JSON.stringify(shortcutOptions);

    // Update status to let user know options were saved.
    var status = document.querySelector('.status');
    status.innerHTML = "Options Saved...";
    setTimeout(function() {
      status.innerHTML = "";
    }, 1500);
  }

  // Restores select box state to saved value from localStorage.
  function restore_options() {
    var shortcutOptions = JSON.parse(localStorage[storageKey]);
    handleKeys(shortcutOptions["keyIdentifier"], shortcutOptions["altKeySelected"], shortcutOptions["controlKeySelected"], shortcutOptions["shiftKeySelected"]);
  }

  initialize();

})();