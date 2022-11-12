import 'dotenv/config';
import {client} from '../src/services/redis';

import Redis from 'redis';

console.log(Redis)

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

    const results = await client.scan(0, {
        MATCH: 'logged*',
        COUNT: 100,
        TYPE: 'hash'
    })
    //console.log(results);
    //await client.sAdd('client1', `asso-2#${Date.now()}#${Date.now()}`);
    //const associateValueKeys = await getClientAssociates('client1',0,'');
    //console.log(deserializeAssociates(associateValueKeys));
   // console.log(await setScan('client1',0, 'asso-2#1667818672687*',50));
   //  const associateValueKeys = await getClientAssociates('client1',0,'');
   //  console.log(deserializeAssociates(associateValueKeys));

    const ss = new Set();
    ss.add('hello');
    ss.add('hi');

    for (let val of ss.values()) {
        console.log(val);
    }


};

const getClientAssociates = async (clientId, cur = 0, pattern, count = 25, associates = [], done = false) => {
    return await setScanIterator(clientId);
    // if (done) {
    //     return associates;
    // }
    // // @ts-ignore
    // const { cursor, members } = await setScan(clientId, cur, pattern, count);
    // if (members.length > 0) {
    //     associates.push(...members)
    // }
    // if (cursor === 0) {
    //     return getClientAssociates(clientId, cursor, pattern, count, associates,true);
    // }
    // else {
    //     return getClientAssociates(clientId, cursor, pattern, count, associates,false);
    // }
}

const setScan = async (key, cursor, pattern = '', count = 2) => {
    try {
        return  await client.sScan(key, cursor, {
            MATCH: pattern,
            COUNT: count,
        })
    } catch (err) {
        console.log(err);
    }
    return false
}

const setScanIterator = async (key, pattern = '' ) => {
    const members = [];
    try {
        for await (const member of client.sScanIterator(key,{
            MATCH: pattern,
        })) {
            members.push(member);
        }
    } catch (err) {
        console.log(err);
    }
    return members
}

const deserializeAssociates = (associateValueKeys) => {
    return associateValueKeys.map((associateValueKey) => {
        const values = getValueFromUserSetKey(associateValueKey)
        if (Object.keys(values).length === 3) {
            return values;
        }
        return  null;
    })
}

const getValueFromUserSetKey = (valueKey) => {
    const valuesArr = valueKey.split('#');
    if (valuesArr.length === 3) {
        return {
            associateId : valuesArr[0],
            lastCachedTime : valuesArr[1],
            cachedTime : valuesArr[2]
        }
    }
    return {}
}

run();
