<?php
$errors = array();
require './php/ui.inc.php';
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="en-US"> 
<head>
<meta charset="utf-8"/>
<title>SUIT Canvas Toolkit Demo</title>
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
var screen = new Screen(document.getElementById('container'));
var label = new Label("Lorem ipsum, dolor sit amet, consectetuer adipscing elit.");
screen.set_child (label);
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
