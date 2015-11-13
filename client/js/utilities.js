class Utilities extends UltimateClass {
	static keyToWord(key) {
		return key.split('_').map(function(word) { 
			return word.capitalizeFirstLetter(); 
		}).join(' ');
	}
	static cleanMarkdown(html) {
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   tmp = tmp.textContent || tmp.innerText || "";
	 return tmp.replace(/(\[.+\]|\(.+\))+/, '');
	}
}