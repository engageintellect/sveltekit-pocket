import { error, redirect } from '@sveltejs/kit';
import { generateUsername } from '../../lib/utils.js';

export const actions = {
	register: async ({ locals, request }) => {
		const body = Object.fromEntries(await request.formData());

		let username = generateUsername(body.name.split(' ').join('')).toLocaleLowerCase();

		try {
			await locals.pb.collection('users').create({ username, ...body });
			await locals.pb.collection('users').requestVerification(body.email);
		} catch (err) {
			console.log('Error: ', err);
			throw error(500, 'Something went wrong. Please try again later.');
		}

		throw redirect(303, '/login');
	}
};
