import neo4j from 'neo4j-driver';

const dbAuth = neo4j.auth.basic('neo4j', 'buzbuz');
const dbConnection = neo4j.driver('bolt://localhost:7687', dbAuth, { disableLosslessIntegers: true });

const runQuery = async (query) => {
    const session = dbConnection.session();
    const dbResult = await session.run(query);

	if (!dbResult.records[0]) {
        return 'ERROR! BAD REQUEST';
    }

    const result = dbResult.records[0].get(0);
    session.close();
    return result;
}


const route1 = await runQuery(`
MATCH p = (busstrt)-[:TRBUS_1 *0..50]->(busend)
WHERE busstrt.name = 'Залізничний вокзал' AND busend.name = '3-я Фабрика ХБК'
RETURN length(p)+1
`);
console.log('\n'+`Кол-во остановок на пути маршрута №1: ${route1}`);
// список
const rlen1 = await runQuery(`
MATCH (a:BusStop {name:'Залізничний вокзал'}), (b:BusStop {name:'3-я Фабрика ХБК'})
MATCH (a)-[r:TRBUS_1 *0..50]->(b)
RETURN min(reduce(totalDist = 0, n IN r | totalDist + n.length))
`);
console.log(`Длина маршрута: ${rlen1} метров`,'\n');

const route9 = await runQuery(`
MATCH p = (busstrt)-[:TRBUS_9 *0..50]->(busend)
WHERE busstrt.name = 'м/н Шуменський' AND busend.name = 'Річпорт'
RETURN length(p)+1
`);
console.log(`Кол-во остановок на пути маршрута №9: ${route9}`);
// список
const rlen9 = await runQuery(`
MATCH (a:BusStop {name:'м/н Шуменський'}), (b:BusStop {name:'Річпорт'})
MATCH (a)-[r:TRBUS_9 *0..50]->(b)
RETURN min(reduce(totalDist = 0, n IN r | totalDist + n.length))
`);
console.log(`Длина маршрута: ${rlen9} метров`,'\n');

const route11 = await runQuery(`
MATCH p = (busstrt)-[:TRBUS_11 *0..50]->(busend)
WHERE busstrt.name = 'Північне селище' AND busend.name = 'Річпорт'
RETURN length(p)+1
`);
console.log(`Кол-во остановок на пути маршрута №11: ${route11}`);
// список
const rlen11 = await runQuery(`
MATCH (a:BusStop {name:'Північне селище'}), (b:BusStop {name:'Річпорт'})
MATCH (a)-[r:TRBUS_11 *0..50]->(b)
RETURN min(reduce(totalDist = 0, n IN r | totalDist + n.length))
`);
console.log(`Длина маршрута: ${rlen11} метров`);



dbConnection.close();