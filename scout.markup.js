/*
 * Scout Validation Framework
 * Copyright 2009 Piotr Kaleta
 * under the LGPL License
 * docs on  http://scout.sakura-studio.pl
*/

(function($){

	$.fn.markCorrect =  function(){	
		return this.each(function(){
			$(this).hideErrorMessage()
				   .getMarkupHolder()
				   .removeClass('incorrect')
				   .addClass('correct');
		});
	};

	$.fn.markIncorrect = function(){
		return this.each(function(){
			$(this).displayErrorMessage()
				   .getMarkupHolder()
				   .removeClass('correct')
				   .addClass('incorrect');
		});
	};

	$.fn.checkCorrect = function(){
		return $(this).hasClass("correct");
	};

	$.fn.checkIncorrect = function(){
		return $(this).hasClass("incorrect");
	};

})(jQuery);