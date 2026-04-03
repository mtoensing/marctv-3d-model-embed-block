( function ( blocks, blockEditor, components, element, i18n, serverSideRender ) {
	const { registerBlockType } = blocks;
	const {
		InspectorControls,
		MediaUpload,
		MediaUploadCheck,
		useBlockProps,
	} = blockEditor;
	const {
		Button,
		PanelBody,
		RangeControl,
		TextControl,
		ToggleControl,
	} = components;
	const { Fragment, createElement: el } = element;
	const { __ } = i18n;
	const ServerSideRender = serverSideRender;
	const textDomain = 'minimal-model-viewer-block';
	const allowedModelTypes = [ 'model/gltf-binary', 'model/gltf+json' ];

	function getFileExtension( value ) {
		if ( ! value ) {
			return '';
		}

		const withoutQuery = String( value ).split( '?' )[ 0 ];
		const parts = withoutQuery.split( '.' );

		return parts.length > 1 ? parts.pop().toLowerCase() : '';
	}

	function isAllowedModelFile( media ) {
		const extension = getFileExtension( media?.filename || media?.url || media?.title?.rendered || media?.title );
		return extension === 'glb' || extension === 'gltf';
	}

	function showModelError() {
		const message = __( 'Bitte nur Dateien mit der Endung .glb oder .gltf auswaehlen.', textDomain );

		if ( window.wp?.data?.dispatch ) {
			window.wp.data.dispatch( 'core/notices' ).createErrorNotice( message, {
				type: 'snackbar',
			} );
			return;
		}

		window.alert( message );
	}

	function mediaButton( label, onClick, isSecondary ) {
		return el(
			Button,
			{
				variant: isSecondary ? 'secondary' : 'primary',
				onClick,
			},
			label
		);
	}

	registerBlockType( 'minimal-model-viewer/block', {
		edit( { attributes, setAttributes } ) {
			const blockProps = useBlockProps();
			const hasModel = !! attributes.modelUrl;

				const modelUpload = el(
					MediaUploadCheck,
					{},
					el( MediaUpload, {
						allowedTypes: allowedModelTypes,
						value: attributes.modelId,
						onSelect: ( media ) => {
							if ( ! isAllowedModelFile( media ) ) {
								showModelError();
								return;
							}

							setAttributes( {
								modelId: media.id,
								modelUrl: media.url || '',
							} );
						},
					render: ( { open } ) =>
						mediaButton(
							hasModel ? __( 'GLB ersetzen', textDomain ) : __( 'GLB aus Mediathek', textDomain ),
							open
						),
				} )
			);

			const posterUpload = el(
				MediaUploadCheck,
				{},
				el( MediaUpload, {
					allowedTypes: [ 'image' ],
					value: attributes.posterId,
					onSelect: ( media ) => {
						setAttributes( {
							posterId: media.id,
							posterUrl: media.url || '',
						} );
					},
					render: ( { open } ) =>
						mediaButton(
							attributes.posterUrl ? __( 'Poster ersetzen', textDomain ) : __( 'Poster waehlen', textDomain ),
							open,
							true
						),
				} )
			);

			return el(
				Fragment,
				{},
				el(
					InspectorControls,
					{},
					el(
						PanelBody,
						{
							title: __( '3D Model', textDomain ),
							initialOpen: true,
						},
						modelUpload,
						el( 'div', { className: 'minimal-model-viewer-block__spacer' } ),
						el( TextControl, {
							label: __( 'GLB oder glTF URL', textDomain ),
							value: attributes.modelUrl || '',
							onChange: ( value ) => setAttributes( { modelUrl: value } ),
							help: __( 'Am einfachsten die Datei in die Mediathek laden und hier die URL oder den Upload-Button nutzen.', textDomain ),
						} ),
						el( TextControl, {
							label: __( 'Alternativtext', textDomain ),
							value: attributes.alt || '',
							onChange: ( value ) => setAttributes( { alt: value } ),
							help: __( 'Leer lassen, wenn das Modell rein dekorativ ist.', textDomain ),
						} ),
						posterUpload,
						attributes.posterUrl
							? el(
								Button,
								{
									variant: 'tertiary',
									onClick: () => setAttributes( { posterId: 0, posterUrl: '' } ),
								},
								__( 'Poster entfernen', textDomain )
							)
							: null
					),
					el(
						PanelBody,
						{
							title: __( 'Anzeige', textDomain ),
							initialOpen: false,
						},
						el( RangeControl, {
							label: __( 'Hoehe in Pixel', textDomain ),
							value: attributes.height || 520,
							min: 260,
							max: 1200,
							step: 10,
							onChange: ( value ) => setAttributes( { height: value } ),
						} ),
						el( TextControl, {
							label: __( 'Hintergrundfarbe', textDomain ),
							value: attributes.backgroundColor || '#f3efe4',
							onChange: ( value ) => setAttributes( { backgroundColor: value || '#f3efe4' } ),
						} ),
						el( ToggleControl, {
							label: __( 'Maus- und Touch-Steuerung', textDomain ),
							checked: !! attributes.cameraControls,
							onChange: ( value ) => setAttributes( { cameraControls: value } ),
						} ),
						el( ToggleControl, {
							label: __( 'Automatisch drehen', textDomain ),
							checked: !! attributes.autoRotate,
							onChange: ( value ) => setAttributes( { autoRotate: value } ),
						} )
					)
				),
				el(
					'div',
					blockProps,
					hasModel
						? el(
							'div',
							{ className: 'minimal-model-viewer-block__preview' },
							el( ServerSideRender, {
								block: 'minimal-model-viewer/block',
								attributes,
							} )
						)
						: el(
							'div',
							{ className: 'minimal-model-viewer-block__empty' },
							el( 'strong', {}, __( '3D Model Viewer', textDomain ) ),
							el(
								'p',
								{},
								__( 'Fuege eine GLB- oder glTF-URL ein oder waehle eine Datei aus der Mediathek.', textDomain )
							)
						)
				)
			);
		},
		save() {
			return null;
		},
	} );
} )(
	window.wp.blocks,
	window.wp.blockEditor,
	window.wp.components,
	window.wp.element,
	window.wp.i18n,
	window.wp.serverSideRender
);
