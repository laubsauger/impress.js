/**
 * impress.studio.js
 *
 * impress.studio.js attempts to provide a rich user interface to create and edit impress.js presentations. 
 *
 * impress.js | MIT Licensed. | Copyright 2011 Bartek Szopka (@bartaz)
 * 
 */
 
function createMenu() {
	'use strict';
	
	var submenu_cat_old, 
		submenu_all = jQuery('.submenu');
		
	function displaySubmenu(oMenuitem, osubmenu, position) {
		jQuery(osubmenu).each(function(index, domEle){
			var sub_id 			= parseInt(domEle.getAttribute('data-submenu-id'),10),
				iPaddingBottom 	= 45,
				iStepHeight 	= 29,
				iPos_bottom 	= (position.bottom || 0) + iPaddingBottom;
			
			iPos_bottom 	= iPos_bottom + (iStepHeight * (sub_id-1));
			jQuery(domEle).appendTo(oMenuitem).fadeIn().css({left: position.left, bottom: iPos_bottom});
			jQuery('.menu').after(osubmenu);
		});
	}	
	
	function openWidget(step, operation) {
		var stepData, 
			stepDim, 
			widget = jQuery('.widget.' + operation);
	
		jQuery('.widget.' + operation)
			.dialog("destroy")
			.dialog({ 
				title: 'step: ' + jQuery(step).attr('id') + ' | op: ' + operation,
				position: 'left'
			}).show();
			
			if(operation === 'edit-position') {
				stepData = getStepData(step);
				stepDim	 = getStepDim(step);
					
				
				jQuery('#height').text(Math.round((stepDim.height * 100)/100));
				jQuery('#width').text(Math.round((stepDim.width * 100)/100));
				jQuery('#top').text(Math.round((stepDim.top * 100)/100));
				jQuery('#left').text(Math.round((stepDim.left * 100)/100));
				
				jQuery('#data-x').text(Math.round((stepData.x * 100)/100));
				jQuery('#data-y').text(Math.round((stepData.y * 100)/100));
				jQuery('#data-z').text(Math.round((stepData.z * 100)/100));
			
			}
	}
	
	function addNewStep () {
		//mockmock
	}
	
	function editPosition(step) {
		var moveX, 
			moveY, 
			moveZ;
		
		//moveX = 30;
		//moveY = 150;
		//moveZ = 200;
		
		//moveStep(step, moveX, moveY, moveZ);
		//rotateStep(step, rotateX, rotateY, rotateZ);
	}
	
	function getStepData (step) {
		var stepData = {
                    x: $(step).data('x') || 0,
                    y: $(step).data('y') || 0,
                    z: $(step).data('z') || 0
				};
		return stepData;
	}
	
	function getStepDim (step) {
		var pos = jQuery(step).position(),
			stepDimension = {
				height: jQuery(step).height(),
				width: 	jQuery(step).width(),
				top: 	pos.top,
				left: 	pos.left
			};
		return stepDimension;
	}
	
	function rotateStep(step, rotateX, rotateY, rotateZ) {
		step.attr('data-rotate-x', parseInt(rotateX) || 0);
		step.attr('data-rotate-y', parseInt(rotateY) || 0);
		step.attr('data-rotate-z', parseInt(rotateZ) || 0);
	}
	
	function moveStep(step, moveX, moveY, moveZ) {
		var posX = step.attr('data-x'),
			posY = step.attr('data-y'),
			posZ = step.attr('data-z');
			
		step.attr('data-x', posX + ( parseInt(moveX) || 0 ));
		step.attr('data-y', posY + ( parseInt(moveY) || 0 ));
		step.attr('data-z', posZ + ( parseInt(moveZ) || 0 ));
	}
	
	//right click step to select it for editing
	jQuery('.step').bind('contextmenu', function(e) {
		var step_selected 	= jQuery('.step-selected'), 
			stepPos 		= jQuery(this).position(),
			stepHeight		= jQuery(this).height(),
			stepWidth		= jQuery(this).width(),
			editFrame 		= jQuery('.edit-frame');
			
		e.preventDefault();
		console.log("X " + stepPos.left + " Y: " + stepPos.top);
		console.log(stepHeight + " x " + stepWidth);
		
		jQuery(this).toggleClass('step-selected');
		jQuery('.step-selected').not(this).removeClass('step-selected');
			
		//prevent contextmenu default action
		return false;
	});
	
	jQuery('.menu-item').bind('click', function() {
		var menuitem 	= this,
		position 		= jQuery(menuitem).position(),	
		submenu_cat 	= menuitem.getAttribute('id'),
		submenu 		= jQuery('.' + submenu_cat + '-sub'),
		submenu_vis_ln	= jQuery('.submenu:visible').length;
		
		jQuery(menuitem).toggleClass('menu-item-active');
		
		if(submenu_vis_ln === 0 ) {
			displaySubmenu(menuitem, submenu, position);
		} else if (submenu_cat_old === submenu_cat) {
			jQuery(submenu_all).hide();
		} else if (submenu_cat_old !== submenu_cat) {
			jQuery(submenu_all).hide();
			displaySubmenu(menuitem, submenu, position);
		}
		
		jQuery('.menu-item-no-sub').bind('click', function() {
			jQuery(submenu_all).hide();
		});
		
		submenu_cat_old = submenu_cat;
	});

	submenu_all.each(function(index, domEle) {
		var submenuId 	= domEle.getAttribute('data-submenu-id'),
			submenuFunc	= domEle.getAttribute('data-submenu-func');
		
		jQuery(domEle).bind('click', function() {
			jQuery(submenu_all).hide();
			switch (submenuFunc) {
				case "save": 
					console.log("submenu:save");
					break;

				case "load": 
					console.log("submenu:load");
					break;

				case "clone": 
					console.log("submenu:clone");
					
					//recreate "canvas" after dom-manipulation
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
					
					var step = jQuery('.step-selected');
					
					if(step.length > 0) {
						openWidget(step, submenuFunc);
					}else {
						console.log('-no step selected');
					}
					
					//recreate "canvas" after dom-manipulation
					//drawCanvas(document, window);
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