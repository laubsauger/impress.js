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
		submenu_all = jQuery('.submenu'),
		livelog_div = jQuery('.livelog');
		
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

	function livelog (elem, msg) {
		$(elem).html($(elem).html() + "<p> " + msg + "</p>");	
		//keep log scrolled to bottom
		$(elem).prop('scrollTop', $(elem).prop('scrollHeight'));
	}
	
	function openWidget(step, operation) {
		var stepData, 
			stepDim, 
			widget = jQuery('.widget.' + operation),
			title;
	
		jQuery(widget).dialog("destroy")
			.dialog({ 
				title: operation + " | ",
				position: 'left'
			}).show();
			
			title = jQuery(widget).dialog('option','title');
			
		if(operation === 'edit-position') {
			editPosition(step, widget, title);
		} else if (operation === 'save') {
			save (step, widget, title);
		}
	}
	
	function addNewStep (id, className, content) {
		//mockmock
	}
	
	function save (step, widget, title) {
		var container = $('#impress'), 
				htmlStr, jsFile, cssFile,
				options = {
					buttons: {
						"to Clipboard": function() { $(this).dialog("close"); }
					},
					width: 500,
					title: title + '<b style="color: red;">unclean solution - uses already manipulated DOMtree - but works :D</b>'
				};
				
		jQuery(widget).dialog( "option", options);
		htmlStr = $('#impress').html();
		htmlStr = htmlStr.replace('class="canvas"', 'id="impress"');
		jsFile = '<script src="js/impress.js"></script>';
		cssFile = 	'<link href="css/impress-demo.css" rel="stylesheet"/>';
		$('.widget.save textarea').text(cssFile + htmlStr + jsFile);
	}
	
	function editPosition(step, widget, title) {
		var moveX, 
			moveY, 
			moveZ,
			stepData = getStepData(step),
			stepDim = getStepDim(step);
			
			jQuery(widget).dialog('option','title',title + jQuery(step).attr('id'));
			
			jQuery('#height').text(stepDim.height);
			jQuery('#width').text(stepDim.width);
			jQuery('#top').text(stepDim.top);
			jQuery('#left').text(stepDim.left);
			
			jQuery('#data-x').text(stepData.x);
			jQuery('#data-y').text(stepData.y);
			jQuery('#data-z').text(stepData.z);
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
				height: Math.round((jQuery(step).height() * 100)/100),
				width: 	Math.round((jQuery(step).width() * 100)/100),
				top: 	Math.round((pos.top * 100)/100),
				left: 	Math.round((pos.left * 100)/100)
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
			editFrame 		= jQuery('.edit-frame'),
			stepDim 		= getStepDim (this);
			
		livelog (livelog_div, "<b>" + this.getAttribute('id') + " </b> selected");
		livelog (livelog_div, "X " + stepDim.left + " Y: " + stepDim.top + " | Dim " + stepDim.height + " x " + stepDim.width);
		
		//highlight selected frame
		jQuery(this).toggleClass('step-selected');
		jQuery('.step-selected').not(this).removeClass('step-selected');
			
		//prevent contextmenu default action
		e.preventDefault();
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
		
		//preserve last used submenu category
		submenu_cat_old = submenu_cat;
	});

	submenu_all.each(function(index, domEle) {
		var submenuId 	= domEle.getAttribute('data-submenu-id'),
			submenuFunc	= domEle.getAttribute('data-submenu-func');
		
		jQuery(domEle).bind('click', function() {
			jQuery(submenu_all).hide();
			switch (submenuFunc) {
				case "save": 
					livelog (livelog_div,"<i>submenu:save</i>");
					openWidget(step, submenuFunc);
					break;

				case "load": 
					livelog (livelog_div,"<i>submenu:load</i>");
					break;

				case "clone": 
					livelog (livelog_div,"<i>submenu:clone</i>");
					
					//recreate "canvas" after dom-manipulation
					//drawCanvas(document, window);
					break;

				case "new-step": 
					livelog (livelog_div,"<i>submenu:new-step</i>");
					break;

				case "edit-content": 
					livelog (livelog_div,"<i>submenu:edit-content</i>");
					break;
				
				case "edit-position":
					livelog (livelog_div,"<i>submenu:edit-position</i>");
					
					var step = jQuery('.step-selected');
					
					if(step.length > 0) {
						openWidget(step, submenuFunc);
					}else {
						livelog (livelog_div,'--no step was selected!');
					}
					
					//recreate "canvas" after dom-manipulation
					//drawCanvas(document, window);
					break;
					
				case "view-styles": 
					livelog (livelog_div,"<i>submenu:view-styles</i>");
					break;
					
				case "view-themes": 
					livelog (livelog_div,"<i>submenu:view-themes</i>");
					break;

				default: livelog (livelog_div,"<i>submenu:function not found - " + submenuFunc + "</i>"); 
			}
		});
	});
}
jQuery(document).ready( createMenu() );
