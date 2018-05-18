const R = require('ramda');
const { getPhero, getScore, realScore, getMax, tourLength, updatePheronome } = require('./Edge');
const { getRow, getTourEdges, updateTour } = require('./Graph');

/** current city -> previous cities -> tour length
 * Ant :: Number -> [Number] -> Number -> a
 */

/**
 * newAnt :: Number -> [Number] -> Ant -> a
 */
const newAnt = R.curry((currentNode, previousNodes, l, Ant) => Ant(currentNode, previousNodes, l));

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
const pickHighestScore = R.curry((B, Ant, Graph) => getUnvisitedNodes(Ant, Graph).reduce(getMax(B)));

/**
 * vertexProbability :: B -> Ant -> Graph -> Edge -> Number
 */
const vertexProbability = R.curry((B, Ant, Graph, Edge) =>
    realScore(B, Edge) / R.sum(getUnvisitedNodes(Ant, Graph).map(realScore(B))));

/**
 * despositGlobalPhero :: Number -> Ant -> Graph -> Graph
 */
const despositGlobalPhero = R.curry((rate, Ant, Graph) =>
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
 * getBestAnt :: [Ant] -> Graph -> Ant
 */
const getBestAnt = ants => ants.reduce(betterAnt);

module.exports = {
    newAnt
};