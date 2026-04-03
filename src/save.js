import { useBlockProps } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';
import { getModelViewerHtml } from './model-viewer';

export default function save( { attributes } ) {
	if ( ! attributes.modelUrl ) {
		return null;
	}

	return (
		<figure { ...useBlockProps.save() }>
			<RawHTML>{ getModelViewerHtml( attributes ) }</RawHTML>
		</figure>
	);
}
