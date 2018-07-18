const R = require('ramda');
const { makeGraphMatrix, convertToMap } = require('./src/data');
const { placeAnts, completeTour } = require('./src/ACO');
const { getEdges, newGraph, nodesNumber } = require('./src/components/Graph');
const { getPhero } = require('./src/components/Edge');
const { getTourLength, getBestAnt, getPreviousNodes } = require('./src/components/Ant');

const { berlin } = require('./src/data/berlin');
const { cities107 } = require('./src/data/107cities');
const { st70 } = require('./src/data/st70');

const BerlinGraph = R.pipe(
    convertToMap,
    makeGraphMatrix,
    getEdges,
    newGraph
)(berlin);

const cities107Graph = R.pipe(
    convertToMap,
    makeGraphMatrix,
    getEdges,
    newGraph
)(cities107);

const st70Graph = R.pipe(
    convertToMap,
    makeGraphMatrix,
    getEdges,
    newGraph
)(st70);

const x = Graph => new Promise(res =>
    completeTour(
        0.7, //q
        4, //B
        7, //amount of pheronome
        0.7, //evaporation rate
        placeAnts(R.range(0, nodesNumber(Graph))),
        Graph,
        updatedAnts => updatedGraph =>
            (x => console.log(x) || x)(getTourLength(getBestAnt(updatedAnts))) < 800 /*change this to stop iteration*/ ? res(getPreviousNodes(getBestAnt(updatedAnts))) :
                setTimeout(_ => x(updatedGraph).then(res), 1)
    ));

//uncomment the statement of your choice

//berlin
//x(BerlinGraph).then(console.log)

//107 cities
//x(cities107Graph).then(console.log);

//70 locations
//x(st70Graph).then(console.log);