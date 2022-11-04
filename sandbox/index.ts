import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
	await client.hSet('loggedUsers#client1#associate-1', {
		clientId: '1',
		associateId: 1
	});
	await client.hSet('loggedUsers#client1#associate-2', {
		clientId: '1',
		associateId: 2
	});
	await client.hSet('loggedUsers#client1#associate-3', {
		clientId: '1',
		associateId: 3
	});

	const results = await client.scan(0,{
		MATCH:'logged*',
		COUNT:100,
		TYPE:'hash'
	})
	console.log(results);
};

const getSetMembers = async (key) => {
	return await client.sMembers(key);
}

run();
