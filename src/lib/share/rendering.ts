import type { SerializedAnnotation } from './types';

export type AnnotationId = SerializedAnnotation['id'];
export type RevisionVersionSelections = Record<string, number>;

export type ParagraphSegment = {
	key: string;
	text: string;
	annotationIds: AnnotationId[];
	trailingMarkers: SerializedAnnotation[];
};

export type ParagraphBlock = {
	id: string;
	start: number;
	end: number;
	leadingMarkers: SerializedAnnotation[];
	segments: ParagraphSegment[];
	annotations: SerializedAnnotation[];
	isBlank: boolean;
};

export type DisplayShare = {
	content: string;
	annotations: SerializedAnnotation[];
};

export type BuildDisplayedShareOptions = {
	includeNestedAnnotations?: boolean;
};

export type SerializedRevisionAnnotation = Extract<SerializedAnnotation, { type: 'revision' }>;
export type SerializedRevisionVersion = SerializedRevisionAnnotation['versions'][number];

export type AnnotationPathEntry = {
	annotation: SerializedAnnotation;
	parentContent: string;
	parentAnnotations: SerializedAnnotation[];
	viaVersionIndex: number | null;
};

export function annotationToneClass(type: SerializedAnnotation['type']) {
	if (type === 'comment') return 'annotation-tone-comment';
	if (type === 'suggestion') return 'annotation-tone-suggestion';
	return 'annotation-tone-revision';
}

export function annotationInlineClass(
	annotation: SerializedAnnotation | undefined,
	isActive: boolean
) {
	if (!annotation) return '';
	if (annotation.type === 'comment') {
		return isActive ? 'annotation-inline-comment-active' : 'annotation-inline-comment';
	}
	if (annotation.type === 'suggestion') {
		return isActive ? 'annotation-inline-suggestion-active' : 'annotation-inline-suggestion';
	}
	return isActive ? 'annotation-inline-revision-active' : 'annotation-inline-revision';
}

export function annotationDepth(annotation: SerializedAnnotation): number {
	return annotation.id.split('.v').length - 1;
}

export function annotationSpan(annotation: SerializedAnnotation): number {
	return Math.max(0, annotation.to - annotation.from);
}

export function getPrimaryInlineAnnotation(
	annotationIds: AnnotationId[],
	annotations: SerializedAnnotation[],
	activeAnnotationId: AnnotationId | null
): SerializedAnnotation | undefined {
	const candidates = annotationIds
		.map((id) => annotations.find((annotation) => annotation.id === id))
		.filter((annotation): annotation is SerializedAnnotation => !!annotation);

	return candidates.sort((a, b) => {
		const activeDelta = Number(b.id === activeAnnotationId) - Number(a.id === activeAnnotationId);
		if (activeDelta !== 0) return activeDelta;

		const depthDelta = annotationDepth(b) - annotationDepth(a);
		if (depthDelta !== 0) return depthDelta;

		const spanDelta = annotationSpan(a) - annotationSpan(b);
		if (spanDelta !== 0) return spanDelta;

		const typeDelta =
			Number(a.type === 'revision') - Number(b.type === 'revision') ||
			Number(b.type === 'comment') - Number(a.type === 'comment');
		if (typeDelta !== 0) return typeDelta;

		return a.id.localeCompare(b.id);
	})[0];
}

export function markerSymbol(type: SerializedAnnotation['type']) {
	if (type === 'comment') return 'C';
	if (type === 'suggestion') return 'S';
	return 'R';
}

export function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export function previewVersionText(version: SerializedRevisionVersion | undefined): string {
	if (!version) return 'Version';
	const trimmed = version.text.replace(/\s+/g, ' ').trim();
	return trimmed ? trimmed.slice(0, 40) : 'Empty version';
}

export function annotationLabel(annotation: SerializedAnnotation): string {
	if (annotation.type === 'comment') return 'Comment';
	if (annotation.type === 'suggestion') return 'AI Suggestion';
	return 'Revision';
}

export function findAnnotationPath(
	targetId: AnnotationId,
	content: string,
	annotations: SerializedAnnotation[]
): AnnotationPathEntry[] | null {
	for (const annotation of annotations) {
		if (annotation.id === targetId) {
			return [
				{
					annotation,
					parentContent: content,
					parentAnnotations: annotations,
					viaVersionIndex: null
				}
			];
		}

		if (annotation.type !== 'revision') continue;

		for (const version of annotation.versions) {
			const nestedPath = findAnnotationPath(targetId, version.text, version.annotations ?? []);
			if (!nestedPath) continue;

			return [
				{
					annotation,
					parentContent: content,
					parentAnnotations: annotations,
					viaVersionIndex: version.index
				},
				...nestedPath
			];
		}
	}

	return null;
}

export type RevisionContextLayer = {
	annotation: SerializedRevisionAnnotation;
	before: string;
	revision: string;
	after: string;
	depth: number;
};

export function buildRevisionContextLayers(
	path: AnnotationPathEntry[],
	outerContextLength = 300
): RevisionContextLayer[] {
	return path
		.filter(
			(entry): entry is AnnotationPathEntry & { annotation: SerializedRevisionAnnotation } =>
				entry.annotation.type === 'revision'
		)
		.map((entry, depth) => {
			const isOuter = depth === 0;
			const contextLength = isOuter ? outerContextLength : entry.parentContent.length;
			const from = clamp(entry.annotation.from, 0, entry.parentContent.length);
			const to = clamp(entry.annotation.to, from, entry.parentContent.length);
			const beforeStart = Math.max(0, from - contextLength);
			const afterEnd = Math.min(entry.parentContent.length, to + contextLength);

			return {
				annotation: entry.annotation,
				before: entry.parentContent.slice(beforeStart, from),
				revision: entry.parentContent.slice(from, to),
				after: entry.parentContent.slice(to, afterEnd),
				depth
			};
		});
}

export function getSelectedRevisionVersionIndex(
	annotation: SerializedAnnotation,
	revisionVersionSelections: RevisionVersionSelections
): number {
	if (annotation.type !== 'revision') return 0;
	return revisionVersionSelections[annotation.id] ?? annotation.activeVersionIndex;
}

export function getSelectedRevisionVersion(
	annotation: SerializedAnnotation,
	revisionVersionSelections: RevisionVersionSelections
) {
	if (annotation.type !== 'revision') return null;
	const selectedIndex = getSelectedRevisionVersionIndex(annotation, revisionVersionSelections);
	return (
		annotation.versions.find((version) => version.index === selectedIndex) ??
		annotation.versions[annotation.activeVersionIndex] ??
		annotation.versions[0] ??
		null
	);
}

export function buildParagraphBlocks(
	content: string,
	annotations: SerializedAnnotation[]
): ParagraphBlock[] {
	const lines = content.split('\n');
	let cursor = 0;

	return lines.map((line, index) => {
		const start = cursor;
		const end = start + line.length;
		cursor = end + 1;

		const paragraphAnnotations = annotations
			.filter((annotation) => {
				if (annotation.from === annotation.to) {
					return annotation.from >= start && annotation.from <= end;
				}

				return annotation.from < end && annotation.to > start;
			})
			.sort((a, b) => a.from - b.from || a.to - b.to || a.id.localeCompare(b.id));

		const collapsedMarkers = new Map<number, SerializedAnnotation[]>();
		const breakpoints = new Set<number>([start, end]);

		for (const annotation of paragraphAnnotations) {
			const from = clamp(annotation.from, start, end);
			const to = clamp(annotation.to, start, end);

			if (from === to) {
				collapsedMarkers.set(from, [...(collapsedMarkers.get(from) ?? []), annotation]);
				continue;
			}

			breakpoints.add(from);
			breakpoints.add(to);
		}

		const points = [...breakpoints].sort((a, b) => a - b);
		const leadingMarkers = collapsedMarkers.get(start) ?? [];
		const segments: ParagraphSegment[] = [];

		for (let pointIndex = 0; pointIndex < points.length - 1; pointIndex += 1) {
			const segmentStart = points[pointIndex];
			const segmentEnd = points[pointIndex + 1];
			if (segmentEnd <= segmentStart) continue;

			const annotationIds = paragraphAnnotations
				.filter((annotation) => {
					const from = clamp(annotation.from, start, end);
					const to = clamp(annotation.to, start, end);
					return from < segmentEnd && to > segmentStart;
				})
				.map((annotation) => annotation.id);

			segments.push({
				key: `${index}-${segmentStart}-${segmentEnd}`,
				text: content.slice(segmentStart, segmentEnd),
				annotationIds,
				trailingMarkers: collapsedMarkers.get(segmentEnd) ?? []
			});
		}

		return {
			id: `paragraph-${index}`,
			start,
			end,
			leadingMarkers,
			segments,
			annotations: paragraphAnnotations,
			isBlank: line.length === 0
		};
	});
}

export function buildDisplayedShare(
	content: string,
	annotations: SerializedAnnotation[],
	revisionVersionSelections: RevisionVersionSelections,
	options: BuildDisplayedShareOptions = {}
): DisplayShare {
	let nextContent = content;
	let nextAnnotations = [...annotations];
	const includeNestedAnnotations = options.includeNestedAnnotations ?? true;

	function mapPositionWithinReplacement(
		position: number,
		replacementStart: number,
		replacementEnd: number,
		replacementTextLength: number
	): number {
		const originalLength = replacementEnd - replacementStart;
		if (originalLength <= 0) return replacementStart;
		const relativeOffset = (position - replacementStart) / originalLength;
		const mappedOffset = Math.round(relativeOffset * replacementTextLength);
		return replacementStart + Math.min(Math.max(mappedOffset, 0), replacementTextLength);
	}

	const revisionSelections = nextAnnotations
		.filter(
			(annotation): annotation is Extract<SerializedAnnotation, { type: 'revision' }> =>
				annotation.type === 'revision'
		)
		.map((annotation) => ({
			annotationId: annotation.id,
			from: annotation.from,
			to: annotation.to,
			selectedVersion: getSelectedRevisionVersion(annotation, revisionVersionSelections)
		}))
		.filter((entry) => !!entry.selectedVersion)
		.sort((a, b) => a.from - b.from);

	for (const entry of revisionSelections) {
		const currentAnnotation = nextAnnotations.find(
			(annotation): annotation is Extract<SerializedAnnotation, { type: 'revision' }> =>
				annotation.id === entry.annotationId && annotation.type === 'revision'
		);
		if (!currentAnnotation || !entry.selectedVersion) continue;

		const nestedDisplayedShare = buildDisplayedShare(
			entry.selectedVersion.text,
			entry.selectedVersion.annotations ?? [],
			revisionVersionSelections,
			options
		);

		const replacementStart = currentAnnotation.from;
		const replacementEnd = currentAnnotation.to;
		const replacementText = nestedDisplayedShare.content;
		const delta = replacementText.length - (replacementEnd - replacementStart);

		nextContent =
			nextContent.slice(0, replacementStart) + replacementText + nextContent.slice(replacementEnd);

		nextAnnotations = nextAnnotations.map((annotation) => {
			if (annotation.id === currentAnnotation.id) {
				return {
					...annotation,
					from: replacementStart,
					to: replacementStart + replacementText.length,
					selectedText: replacementText
				};
			}

			if (annotation.to <= replacementStart) {
				return annotation;
			}

			if (annotation.from >= replacementEnd) {
				return {
					...annotation,
					from: annotation.from + delta,
					to: annotation.to + delta
				};
			}

			let nextFrom = annotation.from;
			let nextTo = annotation.to;

			const isFullyInside = annotation.from >= replacementStart && annotation.to <= replacementEnd;
			const overlapsLeftEdge =
				annotation.from < replacementStart && annotation.to > replacementStart;
			const overlapsRightEdge = annotation.from < replacementEnd && annotation.to > replacementEnd;

			if (isFullyInside) {
				nextFrom = mapPositionWithinReplacement(
					annotation.from,
					replacementStart,
					replacementEnd,
					replacementText.length
				);
				nextTo = mapPositionWithinReplacement(
					annotation.to,
					replacementStart,
					replacementEnd,
					replacementText.length
				);
			} else if (overlapsLeftEdge && annotation.to <= replacementEnd) {
				nextTo = mapPositionWithinReplacement(
					annotation.to,
					replacementStart,
					replacementEnd,
					replacementText.length
				);
			} else if (annotation.from >= replacementStart && overlapsRightEdge) {
				nextFrom = mapPositionWithinReplacement(
					annotation.from,
					replacementStart,
					replacementEnd,
					replacementText.length
				);
				nextTo = annotation.to + delta;
			} else if (annotation.from < replacementStart && annotation.to > replacementEnd) {
				nextTo = annotation.to + delta;
			}

			return {
				...annotation,
				from: nextFrom,
				to: Math.max(nextFrom, nextTo)
			};
		});

		if (includeNestedAnnotations) {
			const mappedNestedAnnotations = nestedDisplayedShare.annotations.map((annotation) => ({
				...annotation,
				from: replacementStart + annotation.from,
				to: replacementStart + annotation.to,
				selectedText: replacementText.slice(annotation.from, annotation.to)
			}));

			nextAnnotations = [
				...nextAnnotations.filter(
					(annotation) => !mappedNestedAnnotations.some((nested) => nested.id === annotation.id)
				),
				...mappedNestedAnnotations
			];
		}
	}

	return {
		content: nextContent,
		annotations: nextAnnotations
			.map((annotation) => ({
				...annotation,
				selectedText: nextContent.slice(annotation.from, annotation.to)
			}))
			.sort((a, b) => a.from - b.from || a.to - b.to || a.id.localeCompare(b.id))
	};
}
