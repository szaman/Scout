/*
 * Scout Validation Framework
 * Copyright 2009 Piotr Kaleta
 * under the LGPL License
 * docs on  http://scout.sakura-studio.pl
*/

$(document).ready(function(){
		if( $('.scout-form').size() )
        	$(".markup-holder").not('.skip-validation').find(".description-label").addHelpIcon();	
});

(function($){
    
    $.fn.addHelpIcon = function(){
		this.each(function(){
            if ( $(this).checkForInstruction('hint_message') ){
                //add help icon
                $(this).prepend('<img class="help-icon" src="'+$.Scout.Engine.imageUrl('help_icon-trans.png')+'" />');
                
				// add display hint effect on mouseover event
              	$(this).mouseenter(function(){
                        $(this).displayHint();
                    }); 
                
				// add hide hint effect on mouse out event
                $(this).mouseleave(function(){
                        $(this).hideHint();
                    });
					
				$(this).mousemove(function(event){
					$('.hint').css({ 'margin-left' : event.pageX + 5,
									 'margin-top'  : event.pageY + 5  });
				});
				
            }
 		});
    };
    
    $.fn.displayHint = function(){
            $(this).getHintHtml()
				   .prependTo('body')
				   .css('opacity',0)
				   .animate({opacity:0.8},400);
    };

    $.fn.hideHint = function(){
            $('.hint').animate({opacity:0},200,function(){
             			$(this).remove();
            		});
    };
        
    $.fn.getHintHtml = function(){
        var hint_message = $.Scout.Engine.traverse($(this).getInstruction('hint_message'));
		return $('<div class="hint" ></div>').append('<div class="hint-message-holder">'+hint_message+'</div>');
    };

})(jQuery);

