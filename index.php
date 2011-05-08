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
</style>
</head>
<body>

<?php
try {
	$ui = new UI('javascript');
	$ui->output_scripts(); ?>

<script type="application/ecmascript">

var suit_screen = new suit.Screen();
var label = new suit.Label("Lorem Ipsum is simply dummy text of the printing and typesetting industry.\n\nLorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\nContrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.\n\nThere are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. Antidisestablishmentarianism");
//label.set_align("center");
label.set_line_height(16*1.2);
var scroller = new suit.Scroller(label);
suit_screen.set_child (scroller);

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
