/*
 * Scout Validation Framework
 * Copyright 2009 Piotr Kaleta
 * under the LGPL License
 * docs on  http://scout.sakura-studio.pl
*/

$.Scout.Defaults = new Object();

$.Scout.Defaults.FieldSetting = {
	'type' :'String', 
	'arbitrary' : 'true',
	'hint_message' : '',
};

$.extend($.Scout.GlobalSettings,$.Scout.Defaults.FieldSetting);

$.Scout.Defaults.Types = {
	'Password' : {
				    validate_at:'blur'
		       },
	'String' : {
				    validate_at:'blur'
		       },
	'Integer' : {
			    	validate_at:'keyUp'
		       },
	'Float' : {
				    validate_at:'blur'
		       },
	'Positive' : {
				    validate_at:'blur'
		       },
	'Natural' : {
				    validate_at:'blur'
		       },
	'Mail' : {
			    	validate_at:'blur'
		       },
	'Char' : {
				    validate_at:'blur'
		       },
};

$.Scout.Defaults.Months = ['January','Ferbruary','March','April','May','June','July','August','September','October','November','December'];

$.Scout.Defaults.Days = [
							{name: 'Monday', abbr : 'Mon'},
							{name: 'Tuesday', abbr : 'Tue'},
							{name: 'Wednesday', abbr : 'Wen'},
							{name: 'Thursday', abbr : 'Thu'},
							{name: 'Friday', abbr : 'Fri'},
							{name: 'Saturday', abbr : 'Sat'},
							{name: 'Sunday', abbr : 'Sun'},
						];



