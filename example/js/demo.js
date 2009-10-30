$(function(){
	$('fieldset legend').nextAll().slideToggle();
	
	$('fieldset legend').click(function(){
		$(this).nextAll().slideToggle(300);
		});
})