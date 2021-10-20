import neo4j from 'neo4j-driver';

const dbAuth = neo4j.auth.basic('neo4j', 'buzbuz');
const dbConnection = neo4j.driver('bolt://localhost:7687', dbAuth, { disableLosslessIntegers: true });

const runQueryPath = async (query) => {
    const session = dbConnection.session();
    const dbResult = await session.run(query);
	if (!dbResult.records[0]) {
        return 'ERROR! BAD REQUEST';
    }
	// маршрут возможно(?) вернее выводить не из stops а из path, хотя вроде и там всё верно
    const resultsNums = dbResult.records[0].get('iLength');
	const resultsStops = dbResult.records[0].get('Stops');
	
    session.close();
	
	let concres = JSON.stringify(resultsStops).concat('\n', ' Расстояние (м): ', JSON.stringify(resultsNums));
	concres = concres.replace(/,/g, ' -> ').replace(/[\[\]"]+/g,'')
	
	return concres;
}

const rStart = 'вул. Залізнична';
const rEnd = 'ЦУМ'

const djkstra = await runQueryPath(`
MATCH (source:BusStop {name: '${rStart}'}), (target:BusStop {name: '${rEnd}'})
CALL gds.shortestPath.dijkstra.stream('pubtrol', {
    sourceNode: source,
    targetNode: target,
    relationshipWeightProperty: 'length'
})
YIELD sourceNode, targetNode, totalCost, nodeIds, costs, path
RETURN
    gds.util.asNode(sourceNode).name AS BusStart,
    gds.util.asNode(targetNode).name AS BusEnd,
    totalCost AS totalLength,
    [nodeId IN nodeIds | gds.util.asNode(nodeId).name] AS Stops,
    costs AS iLength,
    nodes(path) as path
`)
console.log('\n'+`Кратчайший путь между локациями (${rStart} -> ${rEnd}):
 Маршрут: ${djkstra}`);



dbConnection.close();