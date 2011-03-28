
CSSreloader = function() {

	function reload() {
		var elements = window.content.document.querySelectorAll('link[rel=stylesheet][href]');
		for (var i = 0; i < elements.length; ++i) {
			var element = elements[i];
			var h = element.href.replace(/[?&]cssReloader=([^&$]*)/,'');	
			element.href = h + (h.indexOf('?')>=0?'&':'?') + 'cssReloader=' + (new Date().valueOf());		
		}
	}
	
	return {
		reload : reload
	}

}();


