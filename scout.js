/*
 * Scout Validation Framework
 * Copyright 2009 Piotr Kaleta
 * under the LGPL License
 * docs on  http://scout.sakura-studio.pl
 *
*/

$.Scout = new Object();
$.Scout.Engine  = new Object();

$.Scout.GlobalSettings = {
	error_display : 'after',
	time_to_validate_on_key_up : '1000',
	display_password_tooltip : true,
	image_files_path : '../img/scout/',
	password_lvl_evaluation_function : 'mixedCaseAndNumbersForGenso'
};
 
$(document).ready(function(){
	
	//check if .scout-form is present
	if( $('.scout-form').size() ){
		//bind submit action for button and block on submit fail
		$('.form-validation-trigger').click(function(){
			return $(this).parents('.scout-form').validateForm();	
		});
		
		// read instruction from instruction-holders
		
		$('.markup-holder').not('.skip-validation')
						   .prepareField();
				
		$('.markup-holder').not('.skip-validation').find(".validation-target").each(function(){	
			//set proper trigger for keyUp validated text inputs and textareas
			if( $(this).getInstruction('validate_at') == 'keyUp' )
				$(this).not('select,:radio,:checkbox').setValidationOnKeyUp();
					
			if(new RegExp('Password\(.*\)').test($(this).getInstruction('type')) )
				$(this).keyup(function(){
					$(this).displayPasswordLevelHtml();
				});

			
			$(this).blur(function(){
			 	$(this).validate();
			});
			
			// if select then use change instead of keyUp
			$(this).filter('select').change(function(){
				$(this).validate();
			});
			
			//set validation for checkbox and radios
			$(this).filter(':checkbox,:radio').click(function(){
				$(this).validate();
			});
		
			
		});
			
	}
});
 
(function($){
		
	// checks if given instruction is defined for field
	$.fn.checkForInstruction = function(label){
		var instr = this.getMarkupHolder().get(0).instructions[label];		
		return !(typeof instr == "undefined" || instr == '');	
	};

	// reads field configuration to node atribute
	$.fn.prepareField = function(){
		this.each(function(){
			var instructions = $.extend({},$.Scout.Defaults.FieldSetting);
			var user_instructions = eval('('+$(this).getInstructionHolder().text()+')');
			var type = user_instructions['type'];

			if( typeof $.Scout.Defaults.Types[type] != 'undefined')
				$.extend(instructions,$.Scout.Defaults.Types[type]);
			
			$.extend(instructions,user_instructions);
			
			this.instructions = instructions;
	  });
	};

	$.fn.getInstruction = function(label){
		
		return this.checkForInstruction(label)
			   ? this.getMarkupHolder().get(0).instructions[label] 
			   : '';
	};
	
	//check if instruction is avaible, if not it is aquired from global settings
	$.fn.getInstructionOrGlobal = function(label){
		return this.checkForInstruction(label)
			   ? this.getInstruction(label) 
			   : $.Scout.GlobalSettings[label];
	};
 
    $.fn.getMarkupHolder = function(){
        return this.hasClass('markup-holder') 
			   ? this
			   : this.parents('.markup-holder');
    };
	
	$.fn.getInstructionHolder = function(){
		return this.hasClass('markup-holder') 
		       ? this.find('.instruction-holder') 
		       : this.parents('.markup-holder').find('.instruction-holder');
	};
 
	$.fn.getValidationTargetHolder = function(){
		return this.getMarkupHolder().find('.validation-target-holder');
	};
	
	$.fn.getValidationTarget = function(){
		return this.getValidationTargetHolder().find('.validation-target');
	};
 	
	$.fn.getValidationTargetValue = function(){

		var target = this.getValidationTarget();
	
		if( target.is('select') )
			return target.find('option:selected').text();
		
		if( target.is(':checkbox') || target.is(':radio') )
			return target.is(':checked') ? target.filter(':checked').val() : '' ;
		
		if(target.is('textarea'))
			return target.text();
		
		return target.val();
	};

	$.fn.setValidationOnKeyUp = function(){
	 		
		$(this).keyup(function(event){
			
			//get code of pressed key ( IE fix implemented ) 
			 var key_code = ( event.keyCode ? event.keyCode : event.which );
			
			//check if pressed key is not TAB
			 if( key_code != 9 ){
				//trick to get callback in one line {TODO change animate to adequate method}	
				$(this).stop()
					   .animate({opacity:1},
								$.Scout.GlobalSettings['time_to_validate_on_key_up'],
								function(){ $(this).getMarkupHolder().validate(); });					
			 	}
		});
			
		//add on blur timeout clearing
		$(this).blur(function(){
			$(this).stop();	
		});
	};

})(jQuery);
 

$.Scout.Engine.getField = function(name){
	//get all fields
	
	
	var element;
	$('.markup-holder').each(function(){
		if( $(this).getInstruction('name') == name )
			element = $(this).getValidationTarget();
	});
	
	return element;
};
 
//get max from array
$.Scout.Engine.max = function( array ){
    return Math.max.apply( Math, array );
};
 
//get min from array
$.Scout.Engine.min = function( array ){
    return Math.min.apply( Math, array );
};
 
//get local image url
$.Scout.Engine.imageUrl = function(image_address){
	return $.Scout.GlobalSettings['image_files_path']+image_address;
};

$.Scout.Engine.isNumeric = function( val ){
	return new RegExp('^[\\d]+$').test(val);
};
 			
$.Scout.Engine.selectNextOpion = function(){
	
	
};

$.Scout.Engine.traverse = function(str){
	return str.replace(/\{([^\}]+)\}/g,$.Scout.Engine.traverseLiteral);
}	

$.Scout.Engine.traverseLiteral = function(str, offset, s){
	
	var func = str.replace(/\{(.*)\}/,"$1");
	return   $.isFunction($.Scout.Plug.Traversable[func.replace(/\(.*\)/,'')]) 
	 	   ? eval("$.Scout.Plug.Traversable."+func)
		   : str;
};
