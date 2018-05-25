const R = require('ramda');

/**
 * convertToMap :: String -> {Number: [Number, Number]}
 */
const convertToMap = s =>
    Object.assign({}, ...s.split('\n')
        .map(l => l.split(' '))
        .map(([node, x, y]) => ({ [node]: [parseFloat(x), parseFloat(y)] })));

/**
 * distanceBetweenPoints :: [Number, Number] -> [Number, Number] -> Number
 */
const distanceBetweenPoints = R.curry(([x1, y1], [x2, y2]) =>
    Math.sqrt(Math.pow((x1 - x2), 2) + (Math.pow(y1 - y2, 2))));

/**
 * findDistance :: Number -> Number -> {Number: [Number, Number]} -> Number
 */
const findDistance = R.curry((node1, node2, Map) => distanceBetweenPoints(Map[node1], Map[node2]));

/**
 * tourLength :: {Number: [Number, Number]} -> [Number] -> Number
 */
const tourLength = R.curry((Map, nodes) => nodes.length === 1 ? 0 :
    findDistance(nodes[0], nodes[1], Map) + tourLength(Map, R.tail(nodes)));

/**
 * makeGraphMatrix :: {Number: [Number, Number]} -> [[Number]]
 */
const makeGraphMatrix = Map =>
    Object.keys(Map).map(node => Object.keys(Map).map(n => findDistance(node, n, Map)));

module.exports = {
    convertToMap,
    tourLength,
    findDistance,
    makeGraphMatrix
};