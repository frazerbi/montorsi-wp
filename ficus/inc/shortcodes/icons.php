<?php
/* 
* [page-navigator]
*/

function ficus_icon($params = array()) {
	$defaults = array(
		'name' => '',
		'class' => ''
	);
	if (is_array($params)) {
		$configs = array_merge($defaults, $params);
	} else {
		$configs = $defaults;
	}
	$name = $configs['name'];
	$size = 48; // Default size in pixels
	$classes = $configs['class'] ? 'svgicon svgicon-' . $name . ' ' . $configs['class'] : 'svgicon svgicon-' . $name;

	$tpl = <<<COMPONENT
	<svg class="$classes" width="$size" height="$size">
		<use href="#icon-$name"></use>
	</svg>
	COMPONENT;

	return $tpl;
}
add_shortcode('svgicon', 'ficus_icon');

function ficus_home_line() {
	$tpl = <<<COMPONENT
	<svg id="home_line" class="svgdraw" viewBox="0 0 1220 260" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M0.664047 123.737H236.878C295.733 123.737 331.563 151.664 366.557 186.793C458.816 279.404 594.006 302.344 635.738 128.383C675.18 -36.0301 819.995 -46.8066 964.37 128.383C1052.79 235.671 1145.35 209.77 1200.66 122.283"/>
	</svg>
	COMPONENT;
	return $tpl;
}
add_shortcode('svg_home_line', 'ficus_home_line');