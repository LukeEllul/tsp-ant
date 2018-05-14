const R = require('ramda');
const { newEdge } = require('./Edge');

/**
 * Graph :: [[Edge]] -> a
 */

 /**
  * getEdges :: [[Number]] -> [[Edge]]
  */
 const getEdges = map => map.map((r, y) => r.map((d, x) => newEdge(y, x, d, 0)));

 /**
  * newGraph :: [[Edge]] -> Graph -> a
  */
 const newGraph = R.curry((graph, Graph) => Graph(graph));

/**
 * updateGraph :: (Edge -> Edge) -> Number -> Number -> Graph -> Graph
 */
const updateGraph = R.curry((f, y, x, Graph) =>
    Graph(graph => newGraph(R.update(y, R.update(x, f(graph[y][x]))(graph[y]))(graph))));

/**
 * getEdge :: Number -> Number -> Graph -> Edge
 */
const getEdge = R.curry((y, x, Graph) => Graph(graph => graph[y][x]));

module.exports = {
    getEdges,
    newGraph,
    updateGraph,
    getEdge
};