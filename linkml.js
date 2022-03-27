/************************** APPLICATION LAUNCH ********************/

$(document).ready(() => {

	const myDHGrid = document.getElementById('data-harmonizer-grid');
	const myDHToolbar = document.getElementById('data-harmonizer-toolbar');
	const myDHFooter = document.getElementById('data-harmonizer-footer');

	// This is just a way to move toolbar html into place rather than having
	// it loaded dynamically from a separate html file.
	$(myDHToolbar).append($('#data-harmonizer-toolbar-inset'));
	$('#data-harmonizer-toolbar-inset').css('visibility','visible');

	var dh = new Object(DataHarmonizer);
	dh.init(myDHGrid, myDHFooter, myDHToolbar, TEMPLATES);

	// Picks first template in menu if none given.
	var template_path = dh.useTemplate();

	$('#file_name_display').text('');
	if (template_path) {
  		$('#select-template').val('');  // CLEARS OUT?
	}
	else {
		$('#template_name_display').text('Template ' + template_path + " not found!");
  		$('#select-template').val('');  // CLEARS OUT?
	}

	setupToolbarTriggers(dh); // In future this will be qualified with a DOM element id.

});