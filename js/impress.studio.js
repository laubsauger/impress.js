jQuery(document).ready(function() {
	jQuery(document).on("click", ".step", function() {
		var el = jQuery(this);
		jQuery('.edit').removeClass('edit');
		el.addClass('edit');
	});
});