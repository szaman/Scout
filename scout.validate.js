/*
 * Scout Validation Framework
 * Copyright 2009 Piotr Kaleta
 * under the LGPL License
 * docs on  http://scout.sakura-studio.pl
*/

(function($){

	$.fn.checkValidationInFieldset = function(){
		
		var check_result = true;
		
		this.find(".markup-holder").not('.skip-validation').each(function(){
			if( !this.checkCorrect() )
				check_result = false;
		});

		if(check_result){
			this.removeClass('incorrect')
				.addClass('correct');
		}else{
			this.addClass('incorrect')
				.removeClass('correct');
		}
	};
	
	$.fn.validateForm = function(){
		
		var result = true;
		//fetch all div containers from given form and validate them 
		this.find(".markup-holder").not('.skip-validation').each(function(){
			//check validation of single element
			$(this).validate();		
			//if validation is incorrect set result to false
			if( $(this).hasClass('incorrect') )
				result = false;
		});
		
		//if validation was unsuccessful - prevent default event
		return result;
	};

	$.fn.validate = function(){	
		var result = this.getValidationTargetHolder()
						 .checkConstraints();
		result ? this.markCorrect() : this.markIncorrect();		
	};
		
	$.fn.checkConstraints = function(){	

		var type = this.getInstruction('type');
		
		var mandatory = this.getInstruction('mandatory');
		
		var constraints = this.checkForInstruction('constraints') 
						? $.Scout.Engine.traverse(this.getInstruction('constraints'))
										.replace(/[a-zA-Z\-\_]+\(/g,"this.$&")
						:true;

		if( mandatory == 'false' && this.getValidationTargetValue() == '' )
			return true;
		
		return eval(constraints) && eval('this.'+type);
	};

})(jQuery);