export type SerializedThreadMessage = {
	message: string;
	author: string;
	time: number;
};

export type SerializedAnnotationBase = {
	id: string;
	type: 'comment' | 'suggestion' | 'revision';
	from: number;
	to: number;
	selectedText: string;
	thread: SerializedThreadMessage[];
};

export type SerializedAnnotation =
	| (SerializedAnnotationBase & { type: 'comment' })
	| (SerializedAnnotationBase & {
			type: 'suggestion';
			replacements: { text: string; rationale?: string }[];
			author?: string;
	  })
	| (SerializedAnnotationBase & {
			type: 'revision';
			activeVersionIndex: number;
			versions: {
				index: number;
				text: string;
				label?: string;
				annotations: SerializedAnnotation[];
			}[];
	  });
