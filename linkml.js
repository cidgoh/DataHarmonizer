/************************** APPLICATION LAUNCH ********************/

$(document).ready(async () => {

	const myDHGrid = document.getElementById('data-harmonizer-grid');
	const myDHToolbar = document.getElementById('data-harmonizer-toolbar');
	const myDHFooter = document.getElementById('data-harmonizer-footer');

	// This is just a way to move toolbar html into place as an alternative
	// to loading it dynamically from a separate html file.
	$(myDHToolbar).append($('#data-harmonizer-toolbar-inset'));
	$('#data-harmonizer-toolbar-inset').css('visibility','visible');

	let dh = new Object(DataHarmonizer);
	let toolbar = new Object(DataHarmonizerToolbar);

	// Note: TEMPLATES contains templates/menu.js object. It is only required 
	// if using dh.getTemplate() below without specifying a template.
	await dh.init(myDHGrid, myDHFooter, TEMPLATES);

	await toolbar.init(dh, myDHToolbar);

	// Picks first template in dh menu if none given in URL.
	let template_path = dh.getTemplate();
	// Hardcode URL here if desired. Expecting a file path relative to app's template folder.
	await dh.useTemplate(template_path)
	
	await toolbar.refresh(); 

});