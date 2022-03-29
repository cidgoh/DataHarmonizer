/************************** APPLICATION LAUNCH ********************/

$(document).ready(async () => {

	const myDHGrid = document.getElementById('data-harmonizer-grid');
	const myDHToolbar = document.getElementById('data-harmonizer-toolbar');
	const myDHFooter = document.getElementById('data-harmonizer-footer');

	// This is just a way to move toolbar html into place as an alternative
	// to loading it dynamically from a separate html file.
	$(myDHToolbar).append($('#data-harmonizer-toolbar-inset'));
	$('#data-harmonizer-toolbar-inset').css('visibility','visible');

	var dh = new Object(DataHarmonizer);

	// Note: TEMPLATES contains templates/menu.js object. It is only required 
	// if using dh.getTemplate() below without specifying a template.
	dh.init(myDHGrid, myDHFooter, myDHToolbar, TEMPLATES);

	var toolbar = new Object(DataHarmonizerToolbar);
	toolbar.init(dh, myDHToolbar);

	// Picks first template in dh menu if none given in URL.
	var template_path = dh.getTemplate();
	// Hardcode URL here if desired. Expecting a file path relative to app's template folder.
	await dh.useTemplate(template_path)
	
	toolbar.refresh(); 


});