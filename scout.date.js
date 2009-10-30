/*
 * Scout Validation Framework
 * Copyright 2009 Piotr Kaleta
 * under the LGPL License
 * docs on  http://scout.sakura-studio.pl
*/

$.Scout.Date = new Object();



$.Scout.Date.getNumberOfDaysInMonth = function(month, year){
	
	// if only month was provided then assume current year
	if( !$.Scout.Engine.isNumeric(year) ){
		var date = new Date();
		year = date.getFullYear()
	}
	
	var month_number = $.Scout.Date.getMonthNumber(month);
	
	//if wrong month_number was provided then return 0
	if (month_number == -1)
		return 0; 
	
    return 32 - new Date(year, month_number, 32).getDate();
	
};

$.Scout.Date.getMonthNumber = function(month){
	
	var month_number = 	$.Scout.Engine.isNumeric(month) 
						? parseInt(month)
						: $.inArray(month,$.Scout.Defaults.Months);
	
	if ( month_number > 12 || month_number < 0 )
		month_number = -1;
	
	return month_number;
	
};

$.Scout.Date.getMonthsNames = function(){
	return $.Scout.Defaults.Months;
};

$.Scout.Date.getDayIndex = function(day){
};

$.Scout.Date.getDaysNames = function(){

	return $.Scout.Defaults.Days;

};

$.Scout.Date.getIndexOfDayInWeek = function(year,month,day){
	var numeric_month = $.Scout.Date.getMonthNumber(month);
	
	return (new Date(year,numeric_month,day).getDay() + 6 ) % 7 ;
};

$.Scout.Date.dateInRange = function(date,range_date_1,range_date_2){
	
	return 	   ( ( date <= range_date_1 ) && ( date >= range_date_2) ) 
			|| ( ( date <= range_date_2 ) && ( date >= range_date_1) );

};