/**
 * impress.studio.js
 *
 * impress.studio.js attempts to provide a rich user interface to create and edit impress.js presentations. 
 *
 *
 * impress.js is a presentation tool based on the power of CSS3 transforms and transitions
 * in modern browsers and inspired by the idea behind prezi.com.
 * 	
 * MIT Licensed.
 *
 * Copyright 2011 Bartek Szopka (@bartaz)
 */
 
jQuery(document).ready(function() {
	jQuery(document).on("click", ".step", function() {
		var el = jQuery(this);
		jQuery('.edit').removeClass('edit');
		el.addClass('edit');
	});
});