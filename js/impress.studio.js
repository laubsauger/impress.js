/**
 * impress.studio.js
 *
 * impress.studio.js attempts to provide a rich user interface to create and edit impress.js presentations. 
 *
 * impress.js | MIT Licensed. | Copyright 2011 Bartek Szopka (@bartaz)
 * 
 */
 
function createGui() {
	'use strict';
	
	var submenu_cat_old, 
		submenu_all = $('.submenu'),
		livelog_div = $('.livelog'),
		stepIdWasActive,
		stepOverlay = $('.step-edit-overlay');
		
	function displaySubmenu (oMenuitem, osubmenu, position) {
		osubmenu.each(function(index, domEle){
			var sub_id 			= parseInt(domEle.getAttribute('data-submenu-id'),10),
				iPaddingBottom 	= 45,
				iStepHeight 	= 29,
				iPos_bottom 	= (position.bottom || 0) + iPaddingBottom;
			
			iPos_bottom 	= iPos_bottom + (iStepHeight * (sub_id-1));
			$(domEle).appendTo(oMenuitem).fadeIn().css({left: position.left, bottom: iPos_bottom});
			$('.menu').after(osubmenu);
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
			widget = $('.widget.' + operation),
			title;
	
		$(widget).dialog("destroy")
			.dialog({ 
				title: operation + " | ",
				position: 'left'
			}).show();
			
			title = $(widget).dialog('option','title');
			
		if(operation === 'edit-position') {
			editPosition(step, widget, title);
		} else if (operation === 'edit-content') {
			editContent(step, widget, title);
		} else if (operation === 'save') {
			exportToClip (step, widget, title);
		}
	}
	
	function removeEditGizmos (stepOverlay) {
		$('body').append(stepOverlay);
		$(stepOverlay).hide();
	}
	
	function addNewStep (id, className, content) {
		//mockmock
	}
	
	function exportToClip (step, widget, title) {
		var container = $('#impress'), 
				htmlStr, jsFile, cssFile,
				options = {
					buttons: {
						"to Clipboard": function() { $(this).dialog("close"); }
					},
					width: 500,
					resizable: false,
					title: title + '<b style="color: red;">unclean solution - uses already manipulated DOMtree</b>'
				};
				
		$(widget).dialog( "option", options);
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
						}
					},
					beforeClose: function() {removeEditGizmos (stepOverlay)},
					width: 215,
					resizable: false,
					title: title + stepIdActive
				};
			
			//apply/remove overlay
			if (overlayVisible === 0) {
				$(step).append(stepOverlay);
				$(stepOverlay).show();
				resizeOverlay();
			} else if (stepIdWasActive === stepIdActive) { 
				$(stepOverlay).hide();
			} else if (stepIdWasActive !== stepIdActive) {
				$(step).append(stepOverlay);
				$(stepOverlay).show();
				resizeOverlay();
			}
				
			stepIdWasActive = stepIdActive;
			
			function resizeOverlay() {
				$(stepOverlay).css({height: (stepDim.height) + "px", width: (stepDim.width) + "px", top: 0 + "px", left: 0 + "px"})
				//@todo: respect scale / perspective to fit properly
			}
			
			function refreshWidgetData () {
				$(widget).children().children('input').val(0);
				stepDim = getStepDim(step);
				
				$('#height').text(stepDim.height);
				$('#width').text(stepDim.width);
				$('#top').text(stepDim.top);
				$('#left').text(stepDim.left);
				
				$('#data-x').text(stepData.x);
				$('#data-y').text(stepData.y);
				$('#data-z').text(stepData.z);
			}

			function getInputStepData() {
				var PosData = {
					height: $('#input-height').val(),
					width: 	$('#input-width').val(),
					top: 	$('#input-top').val(),
					left: 	$('#input-left').val(),
					dataX: 	$('#input-data-x').val(),
					dataY: 	$('#input-data-y').val(),
					dataZ: 	$('#input-data-z').val()
				}	
				return PosData;
			}
			
			$(widget).dialog('option',options);
			refreshWidgetData();
		
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
		var pos = $(step).position(),
			stepDimension = {
				height: Math.round(($(step).height() * 100)/100),
				width: 	Math.round(($(step).width() * 100)/100),
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
	
	
/* base: jush's slide content editor */ 
	function editContent (step, widget, title) {
	    
		removeEditGizmos (stepOverlay);
		// Replace the contents of the current slide with its own html to be edited
		var ownHtml = $(step).html(),
			options = {
					buttons: {
						"Apply": function() {saveContent(step)}
					},
					resizable: false,
					width: 500,
					beforeClose: function () {$(widget).children('.impress_slide_content').remove()},
					title: title + $(step).attr('id')
				};
				
		// Disable click handle
		$(step).off("click");
		
		document.removeEventListener("keydown", document.filterKeys,  false);
		
		$(widget).children('.impress_slide_content').remove();
		$(widget).dialog('option', options);
		$('.widget.edit-content').append('<textarea class="impress_slide_content" cols="75" row="35">' +  ownHtml + '</textarea>');
	}

	function saveContent (slide) {
		$(slide).click(editContent);
		var newContent = $(".impress_slide_content")[0].value;
		$(slide).empty();
		$(slide).append(newContent);
		
		// Re-enable impress.js key navigation
		document.addEventListener("keydown", document.filterKeys, false);
		
		// Avoid calling editContent immediately by not propagating the event
		return false;
	}
/* base: jush's slide content editor END */ 	

/* base: naugturs position editor PoC */

/* 
* Proof of concept editor for bartaz's impress.js
* by naugtur
* MIT License if anybody asked 
*
*/
	function stepApplyNewPosition () {
		var state={
				editing: false,
				node: false,
				data: {
					x: 0,
					y: 0,
					rotate: 0,
					scale: 0
				}
		  },
		config= {
			rotateStep: 3,
			scaleStep: 1,
			moveStep: 50
		  },
		defaults= {
			x: 0,
			y: 0,
			rotate: 0,
			scale: 1
		  };
		  
	 /* $('body').on('mousedown','.step',function(e){
		state.editing=true;
		state.node=$(this);
		state.node.fadeTo(0.6);
		});
		
	  $('body').on('mouseup','.step',function(e){
		state.editing=false;
		var $t=$(this);
		$t.fadeTo(1);
		});
	*/	
		state.editing=true;
		state.node=$(this);
		
		if(state.editing){
		  var $t=state.node;
		  for(var i in state.data){
			var tmp=$t.attr('data-'+i);
			if(tmp===''){tmp=defaults[i]}
			state.data[i]= ~~(tmp);
			}
			//console.log(['before...',state.data,state.node[0]]);
		   
		  switch(e.which){
			case 113: //q
			  state.data.rotate-=config.rotateStep;
				break;
			case 119: //w
			  state.data.y-=config.moveStep;
				break;
			case 101: //e
			  state.data.rotate+=config.rotateStep;
				break;
			case 97: //a
			  state.data.x-=config.moveStep;
				break;
			case 115: //s
			  state.data.y+=config.moveStep;
				break;
			case 100: //d
			  state.data.x+=config.moveStep;
				break;
			case 122: //z
			  state.data.scale+=config.scaleStep;
				break;
			case 120: //x
			  state.data.scale-=config.scaleStep;
				break;
			  
			default:
			  console.log(e.which);
			  
			  //yeah, I know, but it looks better when it's here
			  break;
		  
		  
			}
		  //console.log(['done...',state.data,state.node[0]]);
		  //reapply all. damn slow  
		  for(var i in state.data){
			$t.attr('data-'+i,state.data[i]);
			}
			
		  window['--drawSlideGlobalHandler'](state.node[0],'whatever')
			
		 }
	}
/* base: naugturs position editor PoC  END */
	
	//right click step to select it for editing
	$('.step').bind('contextmenu', function(e) {
		var step_selected 	= $('.step-selected'),
			stepDim 		= getStepDim (this),
			overlayVisible	= $('.step-edit-overlay:visible').length || 0,
			stepIdActive   	= $(this).attr('id');
			
		//highlight selected frame
		$(this).toggleClass('step-selected');
		$('.step-selected').not(this).removeClass('step-selected');
		
		
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
	
	$('.menu-item').bind('click', function() {
		var menuitem 		= this,
			position 		= $(menuitem).position(),	
			submenu_cat 	= menuitem.getAttribute('id'),
			submenu 		= $('.' + submenu_cat + '-sub'),
			submenu_vis_ln	= $('.submenu:visible').length;
		
		$(menuitem).toggleClass('menu-item-active');
		
		if(submenu_vis_ln === 0 ) {
			displaySubmenu(menuitem, submenu, position);
		} else if (submenu_cat_old === submenu_cat) {
			$(submenu_all).hide();
		} else if (submenu_cat_old !== submenu_cat) {
			$(submenu_all).hide();
			displaySubmenu(menuitem, submenu, position);
		}
		
		$('.menu-item-no-sub').bind('click', function() {
			$(submenu_all).hide();
		});
		
		//preserve last used submenu category
		submenu_cat_old = submenu_cat;
	});

	
	//populate submenus with functions
	submenu_all.each(function(index, domEle) {
		var submenuId 	= domEle.getAttribute('data-submenu-id'),
			submenuFunc	= domEle.getAttribute('data-submenu-func');
		
		$(domEle).bind('click', function() {
			$(submenu_all).hide();
			var step = $('.step-selected');
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
					
					break;

				case "new-step": 
					livelog (livelog_div, "<i>submenu:new-step</i>");
					break;

				case "edit-content": 
					livelog (livelog_div, "<i>submenu:edit-content</i>");
					if(step.length > 0) {
						openWidget(step, submenuFunc);
					}else {
						livelog (livelog_div, "--> error: can't edit - no step selected!");
					}
					break;
				
				case "edit-position":
					livelog (livelog_div, "<i>submenu:edit-position</i>");
										
					if(step.length > 0) {
						openWidget(step, submenuFunc);
					}else {
						livelog (livelog_div, "--> error: can't edit - no step selected!");
					}
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
jQuery(document).ready( createGui() );