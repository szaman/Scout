/*
 * Scout Validation Framework
 * Copyright 2009 Piotr Kaleta
 * under the LGPL License
 * docs on  http://scout.sakura-studio.pl
*/

(function($){
    
    $.fn.displayErrorMessage = function(msg){ 
		var test = false;
		if ( typeof msg == 'undefined')
			msg = '';
		else
			test = true;
			
		return this.each(function(){
				if ($(this).checkForInstruction('error_message')||test){
					$(this).getMarkupHolder().removeClass('correct').addClass('incorrect');
					var target_holder = $(this).getValidationTargetHolder();
					var error_msg =  target_holder.find('.error-message');
					var error_msg_html = $(this).getErrorMessageHtml(msg);
                
					if( error_msg.size() == 0){
						                    	
						if ( $.Scout.GlobalSettings.error_display == 'before')
                        	target_holder.prepend(error_msg_html);
                    	else
                        	target_holder.append(error_msg_html);
						
						target_holder.find('.error-message.generated')
									 .css({display:'none'})
									 .slideDown();
                	}else{
						error_msg.not('.generated').each(function(){
							$(this).replaceWith(error_msg_html);
							$(this).addClass('generated');
						});
					}  
            	}     
		});
        	
	};
	
	
    $.fn.hideErrorMessage = function(){
        return this.each(function(){
            $(this).getValidationTargetHolder()
				   .find('.error-message')
				   .slideUp(500,function(){
									$(this).remove()});
        				   });
    };
    
    $.fn.getErrorMessageHtml = function(msg){
        //check if value is defined
        var error_message = ( msg  == '') ? $(this).getInstruction('error_message') : msg ;         
return $('<div class="error-message generated"></div>').append('<span>'+error_message+'</span>');  
    };
    
})(jQuery);