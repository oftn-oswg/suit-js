<?php
$errors = array();
require './php/ui.inc.php';
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="en-US"> 
<head>
<meta charset="utf-8"/>
<title>SUIT Canvas Toolkit Demo</title>
<link href="http://fonts.googleapis.com/css?family=Cabin:400,400italic,500,500italic,600,600italic,bold,bolditalic" rel="stylesheet" type="text/css"/>
</head>
<body>

<div id="container" style="width: 640px; height: 480px;">
	Loading...
</div>

<?php
try {
	$ui = new UI('javascript');
	$ui->output_scripts(); ?>

<script type="application/ecmascript">
window.addEventListener ("load", function() {
	var suit_screen = new Screen(document.getElementById('container'));
	var button = new Button();
	suit_screen.set_child (button);
	/*label.set_text(
		"FLTK — A light, cross platform, non-native widget toolkit\n" +
		"FOX toolkit — A fast, open source, cross-platform widget toolkit\n" +
		"FrugalWidgets - A minimalistic widget set for Win32\n" +
		"GNUstep — A free software implementation of Cocoa (formerly NeXT's OpenStep) Objective-C libraries\n" +
		"GTK+ — The GIMP toolkit, a widget toolkit used by GNOME applications");*/
}, false);
</script>
<?php
} catch ( DependenciesUnresolvedException $e ) {
	$errors = array_merge($errors, $e->scan_errors());
}
if(count($errors)) { foreach( $errors as $e ) { ?>
<div class="cv_error"><?php echo htmlentities($e); ?></div>
<?php } } ?>
</body>
</html>
