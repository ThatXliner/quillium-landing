import { json } from '@sveltejs/kit';
import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

const resend = new Resend(RESEND_API_KEY);
const TOPIC_ID = '9d4bd82d-a64a-436e-906d-5e793126069f';

export const POST: RequestHandler = async ({ request }) => {
	const { email } = await request.json();

	if (!email || typeof email !== 'string') {
		return json({ error: 'Email is required' }, { status: 400 });
	}

	try {
		const existingContact = await resend.contacts.get({ email });
		const contactExists = Boolean(existingContact.data);

		if (contactExists) {
			const existingTopics = await resend.contacts.topics.list({ email });
			const alreadyOptedIn = existingTopics.data?.data?.some(
				(t) => t.id === TOPIC_ID && t.subscription === 'opt_in'
			);
			if (alreadyOptedIn) {
				return json({ error: 'already_subscribed' }, { status: 409 });
			}

			const { error } = await resend.contacts.topics.update({
				email,
				topics: [{ id: TOPIC_ID, subscription: 'opt_in' }]
			});
			if (error) {
				console.error('Resend topic update error:', error);
				return json({ error: 'Something went wrong' }, { status: 500 });
			}
		} else {
			const { error } = await resend.contacts.create({
				email,
				topics: [{ id: TOPIC_ID, subscription: 'opt_in' }]
			});
			if (error) {
				console.error('Resend error:', error);
				return json({ error: 'Something went wrong' }, { status: 500 });
			}
		}

		const { error: sendError } = await resend.emails.send({
			from: 'Bryan from Quillium <founder@quillium.bryanhu.com>',
			to: [email],
			subject: "You're now on the Quillium Omni waitlist",
			template: { id: 'quillium-omni-waitlist' }
		});

		if (sendError) {
			console.error('Resend template send error:', JSON.stringify(sendError));
		}

		return json({ success: true });
	} catch (err) {
		console.error('Omni waitlist endpoint error:', err);
		return json({ error: 'Something went wrong' }, { status: 500 });
	}
};
