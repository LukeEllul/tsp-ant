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
const getScore = Edge => Edge(_ => _ => d => _ => 1 / d);

module.exports = {
    newEdge,
    getPhero,
    getScore
};