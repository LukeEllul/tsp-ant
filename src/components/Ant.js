const R = require('ramda');

/** current city -> previous cities -> graph
 * Ant :: Number -> [Number] -> Graph -> a
 */

 /**
  * newAnt :: Number -> [Number] -> Graph -> Ant -> a
  */
 const newAnt = R.curry((currentNode, previousNodes, Graph, Ant) => Ant(currentNode, previousNodes, Graph));

 module.exports = {
     newAnt
 };