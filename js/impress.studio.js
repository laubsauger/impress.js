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
 "use strict"
 
jQuery(document).ready(function() {
	var submenu_id_old; 
	
	function displayHideSubMenu(oMenuitem, oSubmenu, position, iPos_bottom) {
		$(oSubmenu).each(function(index, domEle){
				var sub_id = parseInt($(domEle).attr('id'));
				iPos_bottom = iPos_bottom + (29 * (sub_id-1));
				$(domEle).appendTo(oMenuitem).fadeIn().css({left: position.left, bottom: iPos_bottom});
				$('.menu').after(oSubmenu);
		});
	};
	
	jQuery('.menu-item').bind('click', function() {
		var menuitem 	= $(this),
		position 		= $(menuitem).position(),	
		pos_bottom 		= (position.bottom || 0) + 42,
		submenu_id 		= $(menuitem).attr('id'),
		classSubMenu 	= $('.submenu'),
		submenu 		= $('.' + submenu_id + '-sub'),
		submenu_vis_ln	= $('.submenu:visible').length;
		
		$(menuitem).toggleClass('menu-item-active');
		
		if(submenu_vis_ln == 0 ) {
			displayHideSubMenu(menuitem, submenu, position, pos_bottom);
		} else if (submenu_id_old == submenu_id){
			$(classSubMenu).hide();
		} else if (submenu_id_old != submenu_id) {
			$(classSubMenu).hide();
			displayHideSubMenu(menuitem, submenu, position, pos_bottom);
		}
		
		jQuery('.menu-item-no-sub').bind('click', function() {
			$(classSubMenu).hide();
		});
		
		submenu_id_old = submenu_id;
	});
});