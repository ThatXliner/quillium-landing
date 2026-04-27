import { env } from '$env/dynamic/public';
import { createClient } from '@supabase/supabase-js';

export type PublicShare = {
	token: string;
	title: string;
	excerpt: string;
	content: string;
	annotations: SerializedAnnotation[];
	authorName: string | null;
	publishedAt: string | null;
	canonicalUrl: string;
};

type ShareRow = {
	share_token: string;
	published_title: string;
	preview_text: string;
	published_content: string;
	published_annotations: SerializedAnnotation[] | null;
	author_name: string | null;
	published_at: string | null;
};

type SerializedThreadMessage = {
	message: string;
	author: string;
	time: number;
};

type SerializedAnnotationBase = {
	id: string;
	type: 'comment' | 'suggestion' | 'revision';
	from: number;
	to: number;
	selectedText: string;
	thread: SerializedThreadMessage[];
};

type SerializedAnnotation =
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

const SITE_URL = 'https://quillium.bryanhu.com';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getSupabaseEnv() {
	const supabaseUrl = env.PUBLIC_SUPABASE_URL;
	const publishableAnonKey = env.PUBLIC_SUPABASE_PUBLISHABLE_ANON_KEY;

	if (!supabaseUrl || !publishableAnonKey) {
		throw new Error('Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_PUBLISHABLE_ANON_KEY');
	}

	return { supabaseUrl, publishableAnonKey };
}

let supabaseAdmin:
	| ReturnType<typeof createClient<Record<string, never>>>
	| undefined;

function getSupabaseAdmin() {
	if (supabaseAdmin) return supabaseAdmin;
	const { supabaseUrl, publishableAnonKey } = getSupabaseEnv();
	supabaseAdmin = createClient(supabaseUrl, publishableAnonKey, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
			detectSessionInUrl: false
		}
	});
	return supabaseAdmin;
}

export function isShareToken(token: string): boolean {
	return UUID_RE.test(token);
}

export async function loadPublicShare(_fetchFn: typeof fetch, token: string): Promise<PublicShare | null> {
	if (!isShareToken(token)) return null;

	const client = getSupabaseAdmin();
	const { data, error } = await client
		.from('shares')
		.select(
			'share_token,published_title,preview_text,published_content,published_annotations,author_name,published_at'
		)
		.eq('share_token', token)
		.eq('enabled', true)
		.limit(1)
		.maybeSingle<ShareRow>();

	if (error) {
		throw new Error(`Failed to load public share (${error.message})`);
	}

	const share = data;
	if (!share) return null;

	return {
		token: share.share_token,
		title: share.published_title || 'Untitled',
		excerpt: share.preview_text || '',
		content: share.published_content || '',
		annotations: share.published_annotations ?? [],
		authorName: share.author_name,
		publishedAt: share.published_at,
		canonicalUrl: `${SITE_URL}/share/${share.share_token}`
	};
}
