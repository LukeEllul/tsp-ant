const R = require('ramda');
const { getPhero, getScore, realScore, getMax, tourLength, updatePheronome } = require('./Edge');
const { getRow, getTourEdges, updateTour } = require('./Graph');
const { rouletteWheele } = require('../math');

/** current city -> previous cities -> tour length
 * Ant :: Number -> [Number] -> Number -> a
 */

/**
 * newAnt :: Number -> [Number] -> Number -> Ant -> a
 */
const newAnt = R.curry((currentNode, previousNodes, l, Ant) => Ant(currentNode)(previousNodes)(l));

/**
 * getPreviousNodes :: Ant -> [Number]
 */
const getPreviousNodes = Ant => Ant(n => previousNodes => _ => [...previousNodes, n]);

/**
 * getTourLength :: Ant -> Number
 */
const getTourLength = Ant => Ant(_ => _ => l => l);

/**
 * toss :: Number -> Boolean
 */
const toss = q => Math.random() < q;

/**
 * getUnvisitedNodes :: Ant -> Graph -> [Edge]
 */
const getUnvisitedNodes = R.curry((Ant, Graph) =>
    Ant(currentNode => previousNodes => _ =>
        getRow(currentNode, Graph)
            .filter((_, i) => !R.contains(i, [currentNode, ...previousNodes]))));

/**
 * pickHighestScore :: B -> Ant -> Graph -> Edge
 */
const pickHighestScore = R.curry((B, Ant, Graph) => getUnvisitedNodes(Ant, Graph).reduce((E1, E2) => getMax(B, E1, E2)));

/**
 * vertexProbability :: B -> Ant -> Graph -> Edge -> Number
 */
const vertexProbability = R.curry((B, Ant, Graph, Edge) => realScore(B, Edge) === 0 ? 0 :
    realScore(B, Edge) / R.sum(getUnvisitedNodes(Ant, Graph).map(realScore(B))));

/**
 * pickHighestProbabilityEdge :: B -> Ant -> Graph -> Edge
 */
const pickHighestProbabilityEdge = R.curry((B, Ant, Graph) =>
    R.pipe(
        _ => getUnvisitedNodes(Ant, Graph),
        edges => R.pipe(
            R.map(vertexProbability(B, Ant, Graph)),
            rouletteWheele,
            i => edges[i]
        )(edges)
    )());

/**
 * despositGlobalPhero :: Number -> Number -> Ant -> Graph -> Graph
 */
const despositGlobalPhero = R.curry((P, rate, Ant, Graph) =>
    R.pipe(
        getTourEdges(getPreviousNodes(Ant)),
        tourLength,
        n => 1 / Math.abs(n),
        P => updateTour(getPreviousNodes(Ant), updatePheronome(P, rate), Graph)
    )(Graph));

/**
 * betterAnt :: Ant -> Ant -> Ant
 */
const betterAnt = R.curry((Ant1, Ant2) => getTourLength(Ant1) < getTourLength(Ant2) ? Ant1 : Ant2);

/**
 * getBestAnt :: [Ant] -> Ant
 */
const getBestAnt = ants => ants.reduce(betterAnt);

/**
 * pickNextEdge :: Number -> Number -> Ant -> Graph -> Edge
 */
const pickNextEdge = R.curry((q, B, Ant, Graph) =>
    Math.random() < q ? pickHighestScore(B, Ant, Graph) : pickHighestProbabilityEdge(B, Ant, Graph));

/**
 * updateAnt :: Edge -> Ant -> Ant
 */
const updateAnt = R.curry((Edge, Ant) =>
    Ant(currentNode => previousNodes => l =>
        Edge(n1 => n2 => d => _ => newAnt(n2, [...previousNodes, currentNode], l + d))));

module.exports = {
    newAnt,
    pickNextEdge,
    updateAnt,
    getPreviousNodes,
    despositGlobalPhero,
    getBestAnt,
    getTourLength
};