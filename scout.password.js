/*
 * Scout Validation Framework
 * Copyright 2009 Piotr Kaleta
 * under the LGPL License
 * docs on  http://scout.sakura-studio.pl
*/

$.Scout.Password = new Object();

$.Scout.Password.EvaluationFunctions =
{
		mixedCaseAndNumbers : function(str){
			
			var reg_one_upper = /[A-Z].*[A-Z]/;
			var reg_integers =  /^.*[\d].*$/;
			
			//password protection level ( between 0 and $.Scout.Plug.passwords.levels.length-1)
			var lvl = 0;
			//outer if's is basic condition without it password is too weak
			if(str.length > 3 ){
				lvl++;
				//inner if's are ways to improve password
				if(reg_one_upper.test(str)){ lvl++;}
				if(reg_integers.test(str)){ lvl++;}
				if(str.length > 8){ lvl++;}
			}
			return lvl;
		},
		
		mixedCaseAndNumbersForGenso : function(str){
			
			var reg_one_upper = /[A-Z].*[A-Z]/;
			var reg_integers =  /^.*[\d].*$/;
			
			//password protection level ( between 0 and $.Scout.Plug.passwords.levels.length-1)
			var lvl = 0;
			//outer if's is basic condition without it password is too weak
			if(str.length > 6 ){
				lvl++;
				//inner if's are ways to improve password
				if(reg_one_upper.test(str)){ lvl++;}
				if(reg_integers.test(str)){ lvl++;}
				if(str.length > 8){ lvl++;}
			}
			return lvl;
		}
};

$.Scout.Password.Levels = [
		 					  { message : 'Password strength is to low', color : '#f00'},
							  { message : 'Password strength is weak', color : '#f00'},
							  { message : 'Password strength is medium', color : '#ffc000'},
							  { message : 'Password strength is good', color : '#00aeff'},
							  { message : 'Password strength is very good', color : '#0f0'}
			 			  ];


$.Scout.Password.getLevel = function(eval_func,str){
		var lvl = $.Scout.Password.EvaluationFunctions[eval_func](str);
		//if evaluate function was not found than return excellent strength of password
		if( ( typeof lvl != ' undefined' ) && ( lvl <= $.Scout.Password.Levels.length - 1 ) )
			return lvl;
			
		return $.Scout.Password.Levels.length - 1;
};
	
$.Scout.Password.getLevelHtml = function(pass_message){
		
		var msg = '';
		
		if($.Scout.GlobalSettings['display_password_tooltip'])
			msg = $('<div class="password-message"></div>').append('<span>'+pass_message+'</span>');
		
		return $('<div class="password-level-holder"></div>').append('<div class ="password-level-bar"></div>')
															 .append('<div class="border"><div class="fill"></div></div>')
															 .append(msg);
	
};
	
(function($){

	$.fn.displayPasswordLevelHtml = function(){
		    
		    var holder = this.getMarkupHolder();
			var element = this.getValidationTargetHolder();
			var pass_lvl = $.Scout.Password.getLevel($.Scout.GlobalSettings['password_lvl_evaluation_function'],
													 this.getValidationTargetValue());
			var pass_lvl_max = $.Scout.Password.Levels.length - 1;
			var pass_lvl_data = $.Scout.Password.Levels[pass_lvl];
	
	
			if(holder.find('.password-level-holder').size() != 0 ){
				holder.find('.password-message')
					  .text(pass_lvl_data['message']);
			}else{
				holder.append($.Scout.Password.getLevelHtml(pass_lvl_data.message))
					  .find('.password-level-holder')
					  .fadeIn()
					  .css('display','inline-block');
			}
			var border_width = holder.find('.border').width();
	
			holder.find('.fill')
				  .dequeue()
				  .animate({ width : (border_width/(pass_lvl_max))*pass_lvl+'px'} )
				  .css({'background' : pass_lvl_data.color});
				
	};
		
})(jQuery);