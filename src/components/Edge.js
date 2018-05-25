const R = require('ramda');

/**
 *         Node 1 -> Node 2 -> Length -> Phero level
 * Edge :: Number -> Number -> Number -> Number -> a
 */

/**
 * newEdge :: Number -> Number -> Number -> Number -> Edge -> a
 */
const newEdge = R.curry((node1, node2, distance, phero, Edge) => Edge(node1)(node2)(distance)(phero));

/**
 * getPhero :: Edge -> Number
 */
const getPhero = Edge => Edge(_ => _ => _ => phero => phero);

/**
 * getScore :: Edge -> Number
 */
const getScore = Edge => Edge(_ => _ => d => _ => Math.abs(1 / d));

/**
 * realScore :: Number -> Edge -> Number
 */
const realScore = R.curry((B, Edge) => getPhero(Edge) === 0 ? 0 : Math.pow(getPhero(Edge) * getScore(Edge), B));

/**
 * getMax :: Number -> Edge -> Edge -> Edge
 */
const getMax = R.curry((B, E1, E2) => realScore(B, E1) > realScore(B, E2) ? E1 : E2);

/**
 * updatePheronome :: Number -> Number -> Edge -> Edge
 */
const updatePheronome = R.curry((p, rate, Edge) => 
    Edge(n1 => n2 => d => phero => newEdge(n1, n2, d, ((1 - rate) * phero) + (rate * p))));

/**
 * tourLength :: [Edge] -> Number
 */
const tourLength = R.pipe(R.map(Edge => Edge(_ => _ => d => _ => d)), R.sum);

module.exports = {
    newEdge,
    getPhero,
    getScore,
    realScore,
    getMax,
    updatePheronome,
    tourLength
};