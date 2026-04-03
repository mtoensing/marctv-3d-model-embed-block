<?php
/**
 * Server-rendered markup for the Minimal Model Viewer block.
 *
 * @var array  $attributes Block attributes.
 * @var string $content    Block default content.
 * @var WP_Block $block    Block instance.
 */

$model_url = isset( $attributes['modelUrl'] ) ? esc_url( $attributes['modelUrl'] ) : '';
$poster_url = isset( $attributes['posterUrl'] ) ? esc_url( $attributes['posterUrl'] ) : '';
$alt = isset( $attributes['alt'] ) ? sanitize_text_field( $attributes['alt'] ) : '';
$height = isset( $attributes['height'] ) ? (int) $attributes['height'] : 520;
$height = max( 260, min( 1200, $height ) );
$rotation_per_second = isset( $attributes['rotationPerSecond'] ) ? (float) $attributes['rotationPerSecond'] : 30.0;
$rotation_per_second = max( 1.0, min( 120.0, $rotation_per_second ) );
$start_angle = isset( $attributes['startAngle'] ) ? (float) $attributes['startAngle'] : 0.0;
$start_angle = max( -180.0, min( 180.0, $start_angle ) );
$transparent_background = ! empty( $attributes['transparentBackground'] );
$background = isset( $attributes['backgroundColor'] ) ? sanitize_hex_color( $attributes['backgroundColor'] ) : '#f3efe4';
$model_path = $model_url ? (string) wp_parse_url( $model_url, PHP_URL_PATH ) : '';
$model_extension = strtolower( (string) pathinfo( $model_path, PATHINFO_EXTENSION ) );

if ( ! $transparent_background && ! $background ) {
	$background = '#f3efe4';
}

$viewer_attributes = array(
	'class'                => 'wp-block-minimal-model-viewer-block__viewer',
	'src'                  => $model_url,
	'alt'                  => $alt,
	'loading'              => 'lazy',
	'shadow-intensity'     => '1',
	'shadow-softness'      => '0.8',
	'interaction-prompt'   => 'auto',
	'style'                => sprintf(
		'--minimal-model-viewer-height:%1$dpx;--minimal-model-viewer-background:%2$s;',
		$height,
		esc_attr( $transparent_background ? 'transparent' : $background )
	),
);

if ( ! empty( $attributes['cameraControls'] ) ) {
	$viewer_attributes['camera-controls'] = true;
}

if ( ! empty( $attributes['autoRotate'] ) ) {
	$viewer_attributes['auto-rotate'] = true;
	$viewer_attributes['rotation-per-second'] = sprintf( '%gdeg', $rotation_per_second );
}

if ( 0.0 !== $start_angle ) {
	$viewer_attributes['orientation'] = sprintf( '0deg %gdeg 0deg', $start_angle );
}

if ( $poster_url ) {
	$viewer_attributes['poster'] = $poster_url;
}

$viewer_html = '';

foreach ( $viewer_attributes as $name => $value ) {
	if ( true === $value ) {
		$viewer_html .= sprintf( ' %s', esc_attr( $name ) );
		continue;
	}

	if ( false === $value || '' === $value ) {
		continue;
	}

	$viewer_html .= sprintf( ' %1$s="%2$s"', esc_attr( $name ), esc_attr( $value ) );
}

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'wp-block-minimal-model-viewer-block',
	)
);

if ( ! $model_url ) {
	printf(
		'<div %1$s><div class="wp-block-minimal-model-viewer-block__empty">%2$s</div></div>',
		$wrapper_attributes,
		esc_html__( 'GLB- oder glTF-URL fehlt noch.', 'minimal-model-viewer-block' )
	);

	return;
}

if ( ! in_array( $model_extension, array( 'glb', 'gltf' ), true ) ) {
	printf(
		'<div %1$s><div class="wp-block-minimal-model-viewer-block__empty">%2$s</div></div>',
		$wrapper_attributes,
		esc_html__( 'Nur GLB- oder glTF-Dateien werden von diesem Block unterstuetzt.', 'minimal-model-viewer-block' )
	);

	return;
}

printf(
	'<figure %1$s><model-viewer%2$s></model-viewer></figure>',
	$wrapper_attributes,
	$viewer_html
);
