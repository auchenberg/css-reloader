
CSSreloader = function() {

	function reload() {
		var elements = window.content.document.querySelectorAll('link[rel=stylesheet][href]');
		elements.forEach(function(element, index, array) {
			var h = element.href.replace(/[?&]cssReloader=([^&$]*)/,'');	
			element.href = h + (h.indexOf('?')>=0?'&':'?') + 'cssReloader=' + (new Date().valueOf());
		});
	}
	
	return {
		reload : reload
	}

}();


