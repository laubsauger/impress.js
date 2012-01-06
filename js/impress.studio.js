jQuery(document).ready(function() {
	jQuery(document).on("click", ".step", function() {
		var el = jQuery(this);
		el.addClass('edit');
		
		jQuery(document).on('focusout', el, function() {
			el.removeClass('edit');
		});
	});
	
	
});