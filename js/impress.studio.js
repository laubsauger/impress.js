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
function createMenu() {
	'use strict';
	var submenu_cat_old, submenu_all; 
	
	function displayHidesubmenu(oMenuitem, osubmenu, position) {
		jQuery(osubmenu).each(function(index, domEle){
				var sub_id 		= parseInt(domEle.getAttribute('data-submenu-id'),10),
				iPaddingBottom 	= 45,
				iStepHeight 	= 29,
				iPos_bottom 	= (position.bottom || 0) + iPaddingBottom;
				
				iPos_bottom 	= iPos_bottom + (iStepHeight * (sub_id-1));
				jQuery(domEle).appendTo(oMenuitem).fadeIn().css({left: position.left, bottom: iPos_bottom});
				jQuery('.menu').after(osubmenu);
		});
	}
	
	function addNewSlide () {
		
	}
	
	jQuery('.menu-item').bind('click', function() {
		var menuitem 	= this,
		position 		= jQuery(menuitem).position(),	
		submenu_cat 	= jQuery(menuitem).attr('id'),
		classsubmenu 	= jQuery('.submenu'),
		submenu 		= jQuery('.' + submenu_cat + '-sub'),
		submenu_vis_ln	= jQuery('.submenu:visible').length;
		
		jQuery(menuitem).toggleClass('menu-item-active');
		
		if(submenu_vis_ln === 0 ) {
			displayHidesubmenu(menuitem, submenu, position);
		} else if (submenu_cat_old === submenu_cat) {
			jQuery(classsubmenu).hide();
		} else if (submenu_cat_old !== submenu_cat) {
			jQuery(classsubmenu).hide();
			displayHidesubmenu(menuitem, submenu, position);
		}
		
		jQuery('.menu-item-no-sub').bind('click', function() {
			jQuery(classsubmenu).hide();
		});
		

		submenu_cat_old = submenu_cat;
	});
	
    submenu_all = jQuery('.submenu');
	
	submenu_all.each(function(index, domEle) {
		var submenuId = domEle.getAttribute('data-submenu-id'),
		submenuFunc	  = domEle.getAttribute('data-submenu-func');
		
		jQuery(domEle).bind('click', function() {
		
			switch (submenuFunc) {
				case "save": 
					console.log("submenu:save");
					break;

				case "load": 
					console.log("submenu:load");
					break;

				case "clone": 
					console.log("submenu:clone");
					
					//recreate "canvas" after dom-insert
					//drawCanvas(document, window);
					break;

				case "new-step": 
					console.log("submenu:new-step");
					break;

				case "edit-content": 
					console.log("submenu:edit-content");
					break;
				
				case "edit-position": 
					console.log("submenu:edit-position");
					break;
					
				case "view-styles": 
					console.log("submenu:view-styles");
					break;
					
				case "view-themes": 
					console.log("submenu:view-themes");
					break;

				default: console.log("submenu:function not found - " + submenuFunc); 
			}
		});
	});
}

jQuery(document).ready( createMenu() );
