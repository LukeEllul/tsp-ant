const R = require('ramda');
const { makeGraphMatrix, convertToMap } = require('./src/data');
const { placeAnts, completeTour } = require('./src/ACO');
const { getEdges, newGraph, nodesNumber } = require('./src/components/Graph');
const { getPhero } = require('./src/components/Edge');
const { getTourLength, getBestAnt, getPreviousNodes } = require('./src/components/Ant');

const { berlin } = require('./src/data/berlin');

const Graph = R.pipe(
    convertToMap,
    makeGraphMatrix,
    getEdges,
    newGraph
)(berlin);

const x = Graph => new Promise(res =>
    completeTour(
        0.8,
        4,
        7,
        0.7,
        placeAnts(R.range(0, nodesNumber(Graph))),
        Graph,
        updatedAnts => updatedGraph =>
            (x => console.log(x) || x)(getTourLength(getBestAnt(updatedAnts))) < 9000 ? res(getPreviousNodes(getBestAnt(updatedAnts))) :
                setTimeout(_ => x(updatedGraph).then(res), 1)
    ));

x(Graph).then(console.log)

//lowest point:
//9001.23
// [ 44,
//     18,
//     40,
//     7,
//     8,
//     9,
//     42,
//     14,
//     5,
//     4,
//     23,
//     47,
//     36,
//     37,
//     38,
//     39,
//     35,
//     34,
//     33,
//     48,
//     31,
//     0,
//     21,
//     17,
//     30,
//     20,
//     16,
//     2,
//     22,
//     28,
//     45,
//     24,
//     3,
//     50,
//     11,
//     27,
//     26,
//     25,
//     46,
//     12,
//     13,
//     51,
//     10,
//     32,
//     43,
//     49,
//     19,
//     15,
//     29,
//     41,
//     6,
//     1 ]