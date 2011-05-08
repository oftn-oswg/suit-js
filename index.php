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

var label = new suit.Label("This is text from a Label widget that has been added as the child of a Scroller widget. The Scroller widget allows you to use your mouse wheel to scroll text. Scroll bars will be added when it becomes more developed. As a fallback, you can use your mouse to click-and-drag inside the Scroller to pan around. \n\nYou can set preferences to the Label widget to make it suit your needs. Currently you can set the font face, font size, line-height, and alignment (horizontal and vertical).\n\nAnother widget currently developed is the Button, which is unshown.\n\nLorem Ipsum is simply dummy text of the printing and typesetting industry.\n\nContrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.\n\nThere are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. Antidisestablishmentarianism");

label.set_line_height(1.2);
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
