/*
 * Scout Validation Framework
 * Copyright 2009 Piotr Kaleta
 * under the LGPL License
 * docs on  http://scout.sakura-studio.pl
 *
*/




(function($){
	
	$.fn.replaceSymbol = function(symbol,count){
		return this.each(function(){
			if(this.nodeName=="LABEL"){
				var regExp = new RegExp('\('+symbol+'\)');
				$(this).attr('for',$(this).attr('for').replace(regExp,count));
			}else if(this.nodeName=="INPUT"||this.nodeName=="SELECT"){
				var regExp = new RegExp('\('+symbol+'\)');
	        	$(this).attr('id',$(this).attr('id').replace(regExp,count));
	        	$(this).val("");
            	$(this).attr('name',$(this).attr('name').replace(regExp,count));
    		}
		})
	};

	$.fn.selectNextOption = function(){
		//TODO : dodac obsluge gdy option jest ostatni w optgrupie
		var selected_option = $(this).find('option:selected');
		selected_option.attr('selected', false);
    	var next = selected_option.is(':last-child') ? $(this).find('option:first') : selected_option.nextAll('option:first');
    	next.attr('selected', true);
  	};

	$.fn.selectPrevOption = function(){
		var selected_option = $(this).find('option:selected');
		selected_option.attr('selected', false);
    	var prev = selected_option.is(':first-child') ? $(this).find('option:last') : selected_option.prevAll('option:first');
    	prev.attr('selected', true);
  	};


})(jQuery)



	
