CSSreloader = function() {

	function initialize() {
	   document.addEventListener("keyup", onWindowKeyUp, false); 
	}
	
	function reload() {
		var elements = document.querySelectorAll('link[rel=stylesheet][href]');
		for (var i = 0, element; element = elements[i]; i++) {
			var href = element.href.replace(/[?&]cssReloader=([^&$]*)/,'');	
			element.href = href + (href.indexOf('?')>=0?'&':'?') + 'cssReloader=' + (new Date().valueOf());
		}
	}
	
	function onWindowKeyUp(event) {
		if(event.keyCode == 120) {
			reload();
		}
	}
	
	return {
		reload : reload,
		initialize: initialize
	}

}();


CSSreloader.initialize();

