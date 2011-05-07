<?php
$errors = array();
require './php/ui.inc.php';
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="en-US"> 
<head>
<meta charset="utf-8"/>
<title>SUIT Canvas Toolkit Demo</title>
<style type="text/css">
* {
	margin: 0;
	padding: 0;
}
html, body {
	background-color: #000;
	text-align: center;
	color: #fff;
	font-family: sans-serif;
	font-weight: bold;
}
#container {
	width: 640px;
	height: 480px;
	text-align: left;
	position: absolute;
	margin-left: -320px;
	margin-top: -240px;
	top: 50%;
	left: 50%;
}
</style>
</head>
<body>

<div id="container">
	Loading...
</div>

<?php
try {
	$ui = new UI('javascript');
	$ui->output_scripts(); ?>

<script type="application/ecmascript">

var counter = 0;
var suit_screen = new Screen(document.getElementById('container'));
var button = new Button("Hello, world!");
button.connect("activate", function() {
	this.child.set_text("Hello, click "+(++counter)+"!");
});
suit_screen.set_child (button);

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
