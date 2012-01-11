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
		livelog_div = jQuery('.livelog'),
		stepIdWasActive;
		
	function displaySubmenu (oMenuitem, osubmenu, position) {
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
		
		//@todo: keep (displayed) log short or we will get hundreds of elements in a long session
	}
	
	function openWidget (step, operation) {
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
	
	function onCloseWidgetRemoveGizmos (stepOverlay, widget) {
		$(stepOverlay).hide();
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
					resizable: false,
					title: title + '<b style="color: red;">unclean solution - uses already manipulated DOMtree - but works :D</b>'
				};
				
		jQuery(widget).dialog( "option", options);
		htmlStr = $('#impress').html();
		htmlStr = htmlStr.replace('class="canvas"', 'id="impress"');
		jsFile = '<script src="js/impress.js"></script>';
		cssFile = 	'<link href="css/impress-demo.css" rel="stylesheet"/>';
		$('.widget.save textarea').text(cssFile + htmlStr + jsFile);
	}
	
	function editPosition (step, widget, title) {
		var moveX, 
			moveY, 
			moveZ,
			stepData = getStepData(step),
			stepDim = getStepDim(step),
			PosDataNew,
			stepOverlay		= $('.step-edit-overlay'),
			stepDim 		= getStepDim (step),
			stepIdActive   	= $(step).attr('id'),
			overlayVisible	= $('.step-edit-overlay:visible').length || 0,
			options = {
					buttons: {
						"Refresh": function() {
							//Reload step position 
							refreshWidgetData();
						},
						"Apply": function() {
						
							//get inputs
							PosDataNew = getInputStepData();
							//Apply new step position 
							setStepDataPos(step, PosDataNew.dataX, PosDataNew.dataY, PosDataNew.dataZ);
							
							refreshWidgetData();
							//and redraw
							//drawCanvas(document, window);
						}
					},
					beforeClose: function() {onCloseWidgetRemoveGizmos (stepOverlay, widget)},
					width: 215,
					resizable: false,
					title: title + jQuery(step).attr('id')
				};
			
			//apply/remove overlay
			if (overlayVisible === 0) {
				jQuery(step).append(stepOverlay);
				jQuery(stepOverlay).show();
				resizeOverlay();
			} else if (stepIdWasActive === stepIdActive) { 
				jQuery(stepOverlay).hide();
			} else if (stepIdWasActive !== stepIdActive) {
				jQuery(step).append(stepOverlay);
				jQuery(stepOverlay).show();
				resizeOverlay();
			}
				
				stepIdWasActive = stepIdActive;
			
			function resizeOverlay() {
				$(stepOverlay).css({height: (stepDim.height) + "px", width: (stepDim.width) + "px", top: 0 + "px", left: 0 + "px"})
				//@todo: respect scale / perspective to fit properly
			}
			
			function refreshWidgetData () {
				jQuery(widget).children().children('input').val(0);
				stepDim = getStepDim(step);
				
				jQuery('#height').text(stepDim.height);
				jQuery('#width').text(stepDim.width);
				jQuery('#top').text(stepDim.top);
				jQuery('#left').text(stepDim.left);
				
				jQuery('#data-x').text(stepData.x);
				jQuery('#data-y').text(stepData.y);
				jQuery('#data-z').text(stepData.z);
			}

			function getInputStepData() {
				var PosData = {
					height: jQuery('#input-height').val(),
					width: 	jQuery('#input-width').val(),
					top: 	jQuery('#input-top').val(),
					left: 	jQuery('#input-left').val(),
					dataX: 	jQuery('#input-data-x').val(),
					dataY: 	jQuery('#input-data-y').val(),
					dataZ: 	jQuery('#input-data-z').val()
				}	
				return PosData;
			}
			
			jQuery(widget).dialog('option',options);
			refreshWidgetData();
		
		//moveStep(step, moveX, moveY, moveZ);
		//rotateStep(step, rotateX, rotateY, rotateZ);
	}
	
	function getStepData (step) {
		var stepData = {
                    x: jQuery(step).data('x') || 0,
                    y: jQuery(step).data('y') || 0,
                    z: jQuery(step).data('z') || 0
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
	
	function rotateStep (step, rotateX, rotateY, rotateZ) {
		step.attr('data-rotate-x', parseInt(rotateX) || 0);
		step.attr('data-rotate-y', parseInt(rotateY) || 0);
		step.attr('data-rotate-z', parseInt(rotateZ) || 0);
	}
	
	function setStepDataPos (step, moveDataX, moveDataY, moveDataZ) {
		//get step posi
		var pos = getStepData(step);
			
		step.attr('data-x', pos.x + ( parseInt(moveDataX) || 0 ));
		step.attr('data-y', pos.y + ( parseInt(moveDataY) || 0 ));
		step.attr('data-z', pos.z + ( parseInt(moveDataZ) || 0 ));
	}
	
	
/* jush's slide content editor */ 
	function createEditor (step) {
		// Replace the contents of the current slide with its own html to be edited
		var ownHtml = $(step).html();
		$(step).append('<textarea class="impress_slide_content">' +  ownHtml + '</textarea>');

		// Disable click handle
		$(step).off("click");
		document.removeEventListener("keydown", document.filterKeys, false);

		// Add button to save changes
		$(step).append($('<button type="button">Save</button>').click({slide:this}, saveContent));
	}

	function saveContent (event) {
		var slide = event.data.slide;
		$(slide).click(createEditor);
		var newContent = $(slide).children(".impress_slide_content")[0].value;
		$(slide).empty();
		$(slide).append(newContent);
		// Re-enable impress.js key navigation
		document.addEventListener("keydown", document.filterKeys, false);
		// Avoid calling createEditor immediately by not propagating the event
		return false;
	}
/* jush's slide content editor */ 	

	
	//right click step to select it for editing
	jQuery('.step').bind('contextmenu', function(e) {
		var step_selected 	= jQuery('.step-selected'),
			stepDim 		= getStepDim (this),
			overlayVisible	= jQuery('.step-edit-overlay:visible').length || 0,
			stepIdActive   	= $(this).attr('id');
			
		//highlight selected frame
		jQuery(this).toggleClass('step-selected');
		jQuery('.step-selected').not(this).removeClass('step-selected');
		
		
		//apply/remove overlay
		if (overlayVisible === 0) {
			//push some step data to log
			livelog (livelog_div, "<b>" + this.getAttribute('id') + " </b> selected");
			livelog (livelog_div, "Y " + stepDim.top + " X " + stepDim.left + " | Dim " + stepDim.height + " x " + stepDim.width);
		} else if (stepIdWasActive === stepIdActive) {
			//do nothing - same step
		} else if (stepIdWasActive !== stepIdActive) {
			//push some step data to log
			livelog (livelog_div, "<b>" + this.getAttribute('id') + " </b> selected");
			livelog (livelog_div, "Y " + stepDim.top + " X " + stepDim.left + " | Dim " + stepDim.height + " x " + stepDim.width);
		}

		stepIdWasActive = stepIdActive;
		//prevent contextmenu default action
		e.preventDefault();
		return false;
	});
	
	jQuery('.menu-item').bind('click', function() {
		var menuitem 		= this,
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
					livelog (livelog_div, "<i>submenu:save</i>");
					openWidget(step, submenuFunc);
					break;

				case "load": 
					livelog (livelog_div, "<i>submenu:load</i>");
					break;

				case "clone": 
					livelog (livelog_div, "<i>submenu:clone</i>");
					
					//recreate "canvas" after dom-manipulation
					//drawCanvas(document, window);
					break;

				case "new-step": 
					livelog (livelog_div, "<i>submenu:new-step</i>");
					break;

				case "edit-content": 
					livelog (livelog_div, "<i>submenu:edit-content</i>");
					
					var step = jQuery('.step-selected');
					
					if(step.length > 0) {
						openWidget(step, submenuFunc);
					}else {
						livelog (livelog_div, "--> error: can't edit - no step selected!");
					}
					createEditor(step);
					
					break;
				
				case "edit-position":
					livelog (livelog_div, "<i>submenu:edit-position</i>");
					
					var step = jQuery('.step-selected');
					
					if(step.length > 0) {
						openWidget(step, submenuFunc);
					}else {
						livelog (livelog_div, "--> error: can't edit - no step selected!");
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