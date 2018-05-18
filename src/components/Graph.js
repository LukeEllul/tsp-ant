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

/**
 * getRow :: Number -> Graph -> [Edge]
 */
const getRow = R.curry((y, Graph) => Graph(graph => graph[y]));

/**
 * getTourEdges :: [Number] -> Graph -> [Edge]
 */
const getTourEdges = R.curry((nodes, Graph) => nodes.length === 1 ? [] :
    [getEdge(nodes[0], nodes[1], Graph), ...getTourEdges(R.tail(nodes), Graph)]);

/**
 * updateTour :: [Number] -> (Edge -> Edge) -> Graph -> Graph
 */
const updateTour = R.curry((nodes, f, Graph) => nodes.length === 1 ? Graph :
    updateGraph(f, nodes[0], nodes[1], updateTour(R.tail(nodes), f, Graph)));

module.exports = {
    getEdges,
    newGraph,
    updateGraph,
    getEdge,
    getRow,
    getTourEdges,
    updateTour
};