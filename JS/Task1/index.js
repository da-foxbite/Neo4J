import neo4j from 'neo4j-driver';

const dbAuth = neo4j.auth.basic('neo4j', 'buzbuz');
const dbConnection = neo4j.driver('bolt://localhost:7687', dbAuth, { disableLosslessIntegers: true });

const runQuery = async (query) => {
    const session = dbConnection.session();
    const dbResult = await session.run(query);
/*
	if (!dbResult.records[0]) {
        return 'ERROR! NULL RESULT';
    }
*/
    const result = dbResult.records[0].get(0);
    session.close();
    return result;
}


const route1 = await runQuery(`
MATCH p = (busstrt)-[:TRBUS_1 *0..50]->(busend)
WHERE busstrt.name = '3-я Фабрика ХБК' AND busend.name = 'Залізничний вокзал'
RETURN length(p)+1
`);
console.log(`Number of stops in the 1st trolley route: ${route1}`);

const route9 = await runQuery(`
MATCH p = (busstrt)-[:TRBUS_9 *0..50]->(busend)
WHERE busstrt.name = 'Річпорт' AND busend.name = 'м/н Шуменський'
RETURN length(p)+1
`);
console.log(`Number of stops in the 9th trolley route: ${route9}`);

const route11 = await runQuery(`
MATCH p = (busstrt)-[:TRBUS_11 *0..50]->(busend)
WHERE busstrt.name = 'Річпорт' AND busend.name = 'Північне селище'
RETURN length(p)+1
`);
console.log(`Number of stops in the 11th trolley route: ${route11}`);

dbConnection.close();