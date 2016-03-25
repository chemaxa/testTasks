var APP = (function (){
	function init(){
		document.addEventListener("DOMContentLoaded", this.readyDOM);
	}
	function readyDOM(){
		console.log('Dom is ready;');
	}
	return {
		init: init,
		readyDOM: readyDOM
	};
})().init();
