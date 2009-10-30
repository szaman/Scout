/*
 * Scout Validation Framework
 * Copyright 2009 Piotr Kaleta
 * under the LGPL License
 * docs on  http://scout.sakura-studio.pl
 *
*/
$.Scout.Plug = new Object();

$.Scout.Plug.FunctionValidations = {
	
//SET&&EQUAL OPERATORS
	
	//checks if a value is equal to given param
	EqualTo : function(param){
		return  this.getValidationTargetValue() == param;
	},
	
	//checks if a value is equal to ANY given param
	EqualToAny : function(int_arr){
		var val = this.getValidationTargetValue();
		return ($.inArray(parseInt(val),int_arr) != -1)
			||($.inArray(val,int_arr) != -1);
	},
	
	// checks if a value is between MAX and MIN values from given params
	InRange : function(int_arr){
		var val = parseInt(this.getValidationTargetValue());
		
		return  $.Scout.Engine.isNumeric(val) 
				&& val >= $.Scout.Engine.min(int_arr)
				&& val <= $.Scout.Engine.max(int_arr)
	},
	
//ARITMETIC OPERATORS
	
	// checks if a value is grather than ALL given params
	GreaterThan : function(int_arr){
		var val =  this.getValidationTargetValue()
		
		if ( !$.Scout.Engine.isNumeric(val) )
			return false;
		
		
		return val > $.Scout.Engine.max(int_arr);
	},
	
	// checks if a value is grather or equal than ALL given params
	GreaterOrEqualTo : function(int_arr){	
		var val =  this.getValidationTargetValue()
			
		if ( !$.Scout.Engine.isNumeric(val) )
			return false;

		return val >= $.Scout.Engine.max(int_arr);
	},	

	// checks if a value is grater than ANY given param
	GreaterThanAny : function(int_array){
		var val =  this.getValidationTargetValue()
		
		if( !$.Scout.Engine.isNumeric(val) )
			return false;
			
	 	return val > $.Scout.Engine.min(int_array);
	},

	// checks if a value is grater or equal to ANY given param
	GreaterOrEqualToAny : function(int_arr){
		var val =  this.getValidationTargetValue()
		
		if( !$.Scout.Engine.isNumeric(val) )
			return false;
			
	 	return val >= $.Scout.Engine.min(int_arr);
	},	
	
	// checks if a value is smaller than ALL given param
	LessThan : function(int_arr){
		var val =  this.getValidationTargetValue()
		
		if( !$.Scout.Engine.isNumeric(val) )
			return false;
			
		return val < $.Scout.Engine.min(int_arr);
	},
	
	// checks if a value is smaller or equal to ALL given params
	LessOrEqualTo : function(int_arr){
		var val =  this.getValidationTargetValue()
		
		if( !$.Scout.Engine.isNumeric(val) )
			return false;
			
	 	return val <= $.Scout.Engine.min(int_arr);
	},	
	
	// checks if a value is smaller than ANY given param
	LessThanAny : function(int_arr){
		var val =  this.getValidationTargetValue()
		
		if( !$.Scout.Engine.isNumeric(val) )
			return false;
			
	 	return val < $.Scout.Engine.max(int_arr);
	},
	
	// checks if a value is smaller or equal to ANY given param
	// params -> comma separated integers 
	LessOrEqualToAny : function(int_arr){
		var val =  this.getValidationTargetValue()
		
		if( !$.Scout.Engine.isNumeric(val) )
			return false;
			
	 	return val <= $.Scout.Engine.max(int_arr);
	},
	
//INTEGRITY CONSTRAINT OPERATORS

	//return true
	Optional : function(){
		return true;
	},

	//check field to be empty
	Empty : function(){
		return this.getValidationTargetValue() == '';
	},	

	//check if value is different than ''
	Mandatory : function(){
		return this.getValidationTargetValue() != '';
	},
	
	//check if other field is not empty
	OtherFieldNotEmpty : function(name){
		return $.Scout.Engine.getField(name).getValidationTargetValue() != '';
	},
	
	// check if other field is validated to true/false
	OtherFieldValidated : function(name,bool){
		return bool 
		  	   ? $.Scout.Engine.getField(name).checkConstraints() 
			   : !$.Scout.Engine.getField(name).checkConstraints();
		
	},
	
	//check other field validation with given constraint to true/false
	OtherFieldValidatedWith : function(name,constraints,bool){
		var field = $.Scout.Engine.getField(name);
		
		return bool
			   ?  eval(constraints.replace(/this/,"field"))
			   : !eval(constraints.replace(/this/,"field"));
	},

//STRING CONSTRAINTS OPERATORS
	
	//check if field value starts with ANY of given params
	StartsWith : function(str_arr){
		var val = this.getValidationTargetValue();
		for(var i in str_arr)
			if ( new RegExp('^'+str_arr[i]+'.*$').test(val) )
				return true;
		return false;
	},
	
	//check if field value ends with ANY of given params
	EndsWith : function(str_arr){
	
	
		var val = this.getValidationTargetValue();
		for(var i in str_arr)
			if (new RegExp('^.*'+str_arr[i]+'$').test(val))
				return true;
		
		return false;
		
	},
	
	//checks if value contains ANY of given parameters
	Contains : function(str_arr){	
	
			var val = this.getValidationTargetValue();
			for(var i in str_arr)
				if (new RegExp('^.*'+str_arr[i]+'.*$').test(val))
					return true;

			return false;
	},
	
	//checks if value contains no digits
	IsAlphanumeric : function(){
		return new RegExp('^[łóśćźąęa-zA-Z0-9]*$').test(this.getValidationTargetValue());
	},
	
	//checks if value contains no lower case letters
	IsUpperCase : function(){
		return new RegExp('^[^łóśćźąęa-z]*$').test(this.getValidationTargetValue());
	},
	
	//checks if value contains no Capital  letters
	IsLowerCase : function(){
		return new RegExp('^[^A-Z]*$').test(this.getValidationTargetValue());			
	},
	
	//checks if first char of value is Capital letter
	IsInitCap : function(){	
		return new RegExp('^[A-Z]').test(this.getValidationTargetValue());				
	},
	
	//checks if char at n-th position is equal to ANY of given params
	CharAt : function(position,str_arr){
		
		var val = this.getValidationTargetValue();
		
		if(val.legth > position)
			return false;
		
		return $.inArray(val.charAt(position-1),str_arr) != -1;
	},

	//check if field value is longer than given length
	MinLength : function(length){
		return this.getValidationTargetValue().length >= length;
	},
	
	//check if field value is shorter than given length
	MaxLength : function(length){
		return this.getValidationTargetValue().length <= length;
	},
	
	//check if field value has length equal to given parameter
	ExactLength : function(length){
		return this.getValidationTargetValue().length == length;
	},

};

$.fn.extend($.Scout.Plug.FunctionValidations);


$.Scout.Plug.TypeValidations = {

		Email : function(){
			
			return new RegExp("^([łóśćźąęa-zA-Z0-9_\.\-])+\@(([łóśćźąęa-zA-Z0-9\-])+\.)+([łóśćźąęa-zA-Z0-9]{2,4})+$").test(this.getValidationTargetValue());
		},

		Integer : function(){
			return $.Scout.Engine.isNumeric(this.getValidationTargetValue());
		},

		Float : function(){
			return new RegExp('^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$').test(this.getValidationTargetValue());
		},

		Positive : function(){
			var val =  this.getValidationTargetValue()
			if( !$.Scout.Engine.isNumeric(val) )
				return false;
			return val > 0;
		},

		Natural : function(){
			var val = this.getValidationTargetValue();
			return $.Scout.Engine.isNumeric(val) && val>0;
		},

		//check if value is n position char
		Char : function(length){
			//regexp for integer
			return this.getValidationTargetValue().length == length;
		},

		String : function(){
			return true;
		},
		
		Password : function(){
			return true;
		},
		
		Datepicker : function(){
			return true;
		},
		
		PostCode : function(){
			return new RegExp('(^[0-9]{2}-[0-9]{3}$)|(^[0-9]{5}$)').test(this.getValidationTargetValue());
		}
		
};

$.fn.extend($.Scout.Plug.TypeValidations);

$.Scout.Plug.Traversable = {
	
	//return current date in format dd.mm.rrrr
	CurrentDate : function(format){

		var current_date = new Date();
		var day = current_date.getDate();
		var month =current_date.getMonth() + 1;
		
		if (day < 10)
			day = '0'+day;
		
		if (month < 10)
			month = '0'+month; 
		
		return format.replace(/d+/,day)
				      .replace(/m+/,month)
					  .replace(/y+/,current_date.getFullYear());
	},
	
	CurrentDayNumber : function(params){
		return new Date().getDay();
	},
	
	CurrentDayName : function(params){
		return $.Scout.Defaults.Days[new Date().getDay()]['name'];
	},
	
	CurrentMonthNumber : function(params){
		return new Date().getMonth()+1;
	},
	
	CurrentMonthName : function(params){
		return $.Scout.Defaults.Months[new Date().getMonth()];
	},
	
	CurrentYear : function(params){
		return new Date().getFullYear();
	},
	
	CurrentTime : function(time){
		var current_date = new Date();
		var second = current_date.getSeconds();
		var minute = current_date.getMinutes();
		var hour = current_date.getHours();
		
		var ending = '';
		
		if(time == '12')
			if ( hour < 12 ){
				ending = 'AM';
			}else{
				hour =- 12;
				ending = 'PM';
			};
		
		if(second <10)
			second = '0' + second;
		if(minute <10)
			minute = '0' + minute;
		if(hour <10)
			hour = '0' + hour;
		
		return hour+':'+minute+':'+second+' '+ending;
		
	},
	
	CurrentHour : function(time){
		
		
		var current_date = new Date();
		var ending =' ';
		var hour = current_date.getHours();
		
		if(time == '12')
			if ( hour < 12 ){
				ending = 'AM';
			}else{
				hour =- 12;
				ending = 'PM';
			};
			
		return hour + ending;
	},

	CurrentMinute : function(params){
		return new Date().getMinutes();
	},

	CurrentSecond : function(params){
		return new Date().getSeconds();
	},
	
	FieldValue : function(name){
		return '"'+$.Scout.Engine.getField(name).getValidationTargetValue()+'"';	
	},
	
};