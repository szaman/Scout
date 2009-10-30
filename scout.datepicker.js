/*
 * Scout Validation Framework
 * Copyright 2009 Piotr Kaleta
 * under the LGPL License
 * docs on  http://scout.sakura-studio.pl
*/

$.Scout.Datepicker = new Object();
$.Scout.Datepicker.active = new Object();
$.Scout.Datepicker.mouse_is_out = true;

$.Scout.Datepicker.configuration = {
	time_to_hide_calendar : 400,
	week_starts_with_day : 'Monday',
	start_year : 1990,
	end_year : 2010
};

//extend GlobalSettings object
$.extend($.Scout.GlobalSettings,$.Scout.Datepicker.configuration);

$('document').ready(function(){
	$('.scout-form .markup-holder').not('.skip-validation').each(function(){
		
		var type = $(this).getInstruction('type');

		if ( new RegExp('Datepicker\(.*\)').test(type) ){
			$(this).getValidationTarget().focus(function(){
							$('.datepicker-holder').fadeOut($(this).getInstructionOrGlobal('time_to_hide_calendar'));
							$(this).getValidationTargetHolder()
					   				.insertDatepicker( type.replace(/[a-zA-Z\-\_]+\("(.*)"\)/,"$1") );
				 });								 
		}  
	});
	
});

(function($){

	$.fn.insertDatepicker = function(param){
		return this.each(function(){
			if ( !$(this).find('.datepicker-holder').length ){
			 	 $(this).constructDatepicker(param);
			}
		
			$(this).find('.datepicker-holder')
				   .fadeOut(0)
			       .fadeIn(400);
		
			$.Scout.Datepicker.active = $(this).find('.datepicker-holder').get(0);
			
			$(document).bind('keypress',$.Scout.Datepicker.hideDatepickerOnTab);
		});
	};
	
	$.fn.hideDatepicker = function(){
		return this.each(function(){
			$(this).getValidationTargetHolder().find('.datepicker-holder')
											   .fadeOut($(this).getInstructionOrGlobal('time_to_hide_calendar'));
		});
	};
	$.fn.constructDatepicker = function(param){
		
		this.append($.Scout.Datepicker.constructFrame());
		
		switch(param){
			case 'day' : 	this.find('.datepicker-holder')
								.addMonthSelect()
								.addYearSelect()
								.addDaysTableHeaders()
								.bind('refresh',function(){ $(this).fillTableWithDays()
																   .pickDateOnClick(); })
								.trigger('refresh')
							break;

			case 'month' :	this.find('.datepicker-holder')
								.addYearSelect()
								.fillTableWithMonths()
								.pickDateOnClick();
							break;

				
			case 'year' : 	this.find('.datepicker-holder')
								.addDecadeSelect()
								.bind('refresh',function(){ $(this).fillTableWithYears()
									 					    	   .pickDateOnClick(); })
								.trigger('refresh');
							break;
								
			case 'dayrange' : this.find('.datepicker-holder')
							  	  .addMonthSelect()
								  .addYearSelect()
								  .addDaysTableHeaders()
								  .setRangeAtributes()
								  .bind('refresh',function(){ $(this).fillTableWithDays()
									 								 .pickDateRangeOnClick(); })
								  .trigger('refresh');
							  break;
							
			case 'monthrange' :	this.find('.datepicker-holder')
									.addYearSelect()
									.fillTableWithMonths()
									.setRangeAtributes()
									.bind('refresh',function(){ $(this).fillTableWithMonths()
									 								   .pickDateRangeOnClick(); })
									.trigger('refresh');
								break;


			case 'yearrange' : 	this.find('.datepicker-holder')
									.addDecadeSelect()
									.bind('refresh',function(){ $(this).fillTableWithYears()
										 					    	   .pickDateRangeOnClick(); })
									.trigger('refresh');
									break;
		}
		
	};
	
	$.fn.addDaysTableHeaders = function(){
		var days = $.Scout.Date.getDaysNames();
		return this.each(function(){
			var days_table_head = $('<thead />').prependTo($(this).find('.time-intervals'))		
										
			for(var i in days)
				$('<th />').appendTo(days_table_head).html((days[i]).abbr);
				
		});
	};
	$.fn.addCloseButton = function(){
		return this.each(function(){
			$(this).append('<div class="close-button"><img src="'+$.Scout.Engine.imageUrl('close-button.png')+'"</img></div>');
			$(this).find('.close-button').click(function(){
				$(this).parents('.datepicker-holder').hideDatepicker();
			});
		});
	};
	$.fn.addMonthSelect = function(){
		var months = $.Scout.Date.getMonthsNames();
		return this.each(function(){
			var nav_months  = $('<select />').addClass('months')
											 .insertAfter( $(this).find('.select-holder') )
				   							 .change(function(){ $(this).trigger('refresh'); });
			
			for(var i in months)
				nav_months.append('<option class="month" value="'+( parseInt(i) + 1 )+'">'+months[i]+'</option>');
		});
	};
	$.fn.addYearSelect = function(){
		return this.each(function(){
				var nav_years  = $('<select />').addClass('years')
												.insertAfter( $(this).find('.select-holder') )
					   							.change(function(){ $(this).trigger('refresh'); });
					
				for(var i = $(this).getInstructionOrGlobal('start_year'); 
					i < $(this).getInstructionOrGlobal('end_year')+1;i++)
			 			nav_years.append('<option class="year">'+i+'</option>');
		});
	};
	$.fn.addDecadeSelect = function(){
		return this.each(function(){
				
				var nav_decades  = $('<select />').addClass('decades')
												.insertAfter( $(this).find('.select-holder') )
					   							.change(function(){ $(this).trigger('refresh'); });
				
				var y = parseInt( $(this).getInstructionOrGlobal('start_year') );
				
				if ( ( y % 10 ) )
					y = y - ( y % 10 );
				var end_year = parseInt( $(this).getInstructionOrGlobal('end_year') );

				while( y < end_year){
						decade_end = ( ( y + 9 ) < end_year ) ? y + 9 : end_year;
						nav_decades.append('<option class="year">'+y+'-'+decade_end+'</option>');
						y = decade_end + 1;
				}
		});
	};
		
	$.fn.fillTableWithDays = function(){
		return this.each(function(){

			var month = $(this).find('.months option:selected').text();
			var year = $(this).find('.years option:selected').text();		
			
			var first_day_index = $.Scout.Date.getIndexOfDayInWeek(year,month,1);
			var days_number = $.Scout.Date.getNumberOfDaysInMonth(month,year);
			
			var needed_rows = parseInt( ( first_day_index + days_number ) / 7);
			
			if( ( first_day_index+days_number ) % 7 )
				needed_rows++;
				
			var days_table_body = $(this).find('.time-intervals tbody').html('');
			var td_class;
			var td_text;
			
			for(var i=0; i < needed_rows;i++){
				days_table_body.append('<tr />');
					for(var j=0;j<7;j++){	
						td_class ='day time-unit';
						td_text = i*7+j+1 - first_day_index;
						if( ( days_number <= 0 ) || ( i== 0 && j < first_day_index )){
							td_class = '';
							td_text = '';
						}else{
							days_number--;
						}
						days_table_body.find('tr:last')
									   .append('<td class="'+td_class+'">'+td_text+'</td>');
					}	
		  	}
		});		
	};
	$.fn.fillTableWithMonths = function(){
		return this.each(function(){
			
			var months = $.Scout.Date.getMonthsNames();
			var table_body = $(this).find('.time-intervals tbody').html('');
			
			for(var i = 0; i < months.length ; i++)
				$('<tr />').appendTo(table_body)
						   .append('<td class="month time-unit">'+months[i]+'</td>')
						   .append('<td class="month time-unit">'+months[++i]+'</td>')
						   .append('<td class="month time-unit">'+months[++i]+'</td>');
		});	
		
	};
	$.fn.fillTableWithYears = function(){
		return this.each(function(){
			
			var table_raw = $(this).find('.time-intervals tbody').html('').append('<tr />').find('tr');
			
			var start_year = parseInt($(this).getInstructionOrGlobal('start_year'));
			var end_year = parseInt($(this).getInstructionOrGlobal('end_year'));
			
			var decade_start = parseInt($(this).find('.decades option:selected')
											   .text()
											   .replace(/(\d+)\-\d+/,"$1"));

			var decade_end =   end_year < (decade_start + 9 ) 
							 ? end_year 
							 : decade_start + 9 ;
			
			var td_class;
			var td_text;
			for( var i = decade_start; i <= decade_end; i++){
				td_class = 'year time-unit';
				td_text = i;
				if ( i % 10 == 5)
					table_raw = $('<tr />').appendTo(table_raw.parent());
				if ( i < start_year ){
					td_class = '';
					td_text = '';
				}
				table_raw.append('<td class="'+td_class+'">'+td_text+'</td>');
			}	
		});	
		
	};
	
	$.fn.setRangeAtributes = function(){
		return this.each(function(){
			this.date = new Object();
			this.lock = false;
		});
	}
			
	$.fn.pickDateOnClick = function(){
		return this.each(function(){
				$(this).find('td').bind('click',function(){
											$(this).getValidationTarget().val( $(this).pickDate() );
											$(this).parents('.datepicker-holder').hideDatepicker();
						 		   })
								  .hover( function(){ $(this).addClass('hover'); },
								          function(){ $(this).removeClass('hover'); } );
		});
	};	
	$.fn.pickDateRangeOnClick = function(){
		
		return this.each(function(){
			
			var defaults = {};
		
			$(this).find('.months option:selected').each(function(){
				$.extend(defaults, { month : parseInt($(this).val()) }); 
			 });
			
			$(this).find('.years option:selected').each(function(){
				$.extend(defaults, { year : parseInt($(this).text()) });
			});
			
			
			$(this).find('td').each(function(){
				
				var datepicker = $(this).parents('.datepicker-holder').get(0);
			
				$(this).bind('mouseenter mouseleave', function(){
				if( datepicker.lock ){
					var selected_date = $(this).constructDateFromField(defaults); 
					$(datepicker).find('td.time-unit')
						  	  	 .removeClass('hover')
						  	 	 .each(function(){
									if( $.Scout.Date.dateInRange( $(this).constructDateFromField(defaults), datepicker.date, selected_date )){
									  	 $(this).addClass('hover');
									}
						  	  	  });
				}
			});
			
				$(this).bind('click',function(){
					
					$(datepicker).find('td.time-unit').removeClass('hover');
					datepicker.lock = !datepicker.lock;

					if( datepicker.lock ){
						datepicker.date = $(this).constructDateFromField(defaults);
						datepicker.field = $(this);
					}else{
						
						
						var str =  datepicker.date > $(this).constructDateFromField(defaults) 
								  ? $(this).pickDate() + ' / ' + datepicker.field.pickDate() 
								  : datepicker.field.pickDate() + ' / ' + $(this).pickDate();
							
						$(this).getValidationTarget()
					   	   	   .val( str )
					   	       .end()
					           .hideDatepicker();
					}
				});	
			});
		
		});
	}
	$.fn.pickDate = function(){
		
		var datepicker = $(this).parents('.datepicker-holder');
		var result = $(this).text()

		datepicker.find('.months option:selected').each(function(){
			result += '-'+$(this).val();
		});
		
		datepicker.find('.years option:selected').each(function(){
			result += '-'+$(this).val();
		});
		
		return result;

	}


	$.fn.constructDateFromField = function(defaults){
		
		if( this.is('.day') )
			return $.Scout.Datepicker.constructDate( $.extend( defaults, { day : parseInt($(this).text()) } ) );
			
		if( this.is('.month') )
			return $.Scout.Datepicker.constructDate( $.extend( defaults, { month : $.inArray( $(this).text() , $.Scout.Defaults.Months) } ));
												
		if( this.is('.year') )
			return $.Scout.Datepicker.constructDate( $.extend( defaults, { year : parseInt($(this).text()) }) );
	};

})(jQuery);

$.Scout.Datepicker.constructDate = function(options){
	
	var defaults = {
		 day : 1,
	 	 month : 1,
		 year : parseInt($.Scout.GlobalSettings.start_year),
 	};
	
	options = $.extend({},defaults,options);
	
	return new Date(options.year,options.month - 1,options.day);
}

$.Scout.Datepicker.nextTimeInterval = function(){
	
	var datepicker = $(this).parents('.datepicker-holder');
	
	datepicker.find('.months').each(function(){
		$(this).selectPrevOption();
		if($(this).find('option:selected:last-child').size())
			datepicker.find('.years').selectPrevOption();
	});
	
	//if there is no months select ( example : datepicker for years ) 
	if( !(datepicker.find('.months').size()) )
		datepicker.find('.years').selectPrevOption();

	datepicker.find('.decades').selectPrevOption();
	

	$(this).trigger('refresh');
};
$.Scout.Datepicker.prevTimeInterval = function(){

	var datepicker = $(this).parents('.datepicker-holder');
	
	datepicker.find('.months').each(function(){
		$(this).selectNextOption();
		if($(this).find('option:selected:first-child').size())
			datepicker.find('.years').selectNextOption();
	});
	
	//if there is no months select ( example : datepicker for years ) 
	if( !(datepicker.find('.months').size()) )
		datepicker.find('.years').selectNextOption();

	datepicker.find('.decades').selectNextOption();
	
	$(this).trigger('refresh');
};

$.Scout.Datepicker.hideDatepickerOnTab = function(event){
	if (event.which == 0){
		$($.Scout.Datepicker.active).getValidationTarget().next('input').focus();
		$($.Scout.Datepicker.active).hideDatepicker();
		$(document).unbind('keypress',$.Scout.Datepicker.hideDatepickerOnTab);
		$(document).unbind('unbind',$.Scout.Datepicker.hideDatepickerOnClick);
		
	}
};



$.Scout.Datepicker.constructFrame = function(){
	return $('<div class="datepicker-holder" />').addCloseButton()
												 .append('<div class="navigation"/>')
												 .find('.navigation')
												 .append('<div class="navigation-button forward"><img src="'+$.Scout.Engine.imageUrl('navigation-button-forward.png')+'"/></div>')
									     		 .append('<div class="select-holder" />')
										 		 .append('<div class="navigation-button backward"><img src="'+$.Scout.Engine.imageUrl('navigation-button-backward.png')+'"/></div>')
												 .end()
												 .find('.navigation-button.forward')
												 .bind('click',$.Scout.Datepicker.nextTimeInterval)
												 .end()
												 .find('.navigation-button.backward')
												 .bind('click',$.Scout.Datepicker.prevTimeInterval)
												 .end()
												 .append('<table class="time-intervals"><tbody></tbody></table>');
};