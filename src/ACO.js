const R = require('ramda');
const { updateGraph, nodesNumber } = require('./components/Graph');
const { updatePheronome } = require('./components/Edge');
const { newAnt, updateAnt, pickNextEdge, getPreviousNodes, despositGlobalPhero, getBestAnt } = require('./components/Ant');

/**
 * placeAnts :: [Number] -> [Ant]
 */
const placeAnts = R.map(n => newAnt(n, [], 0));

/**Drop pheronome after Ant is updated!!
 * 
 * dropPhero :: Number -> Number -> Ant -> Graph -> Graph
 */
const dropPhero = R.curry((p, rate, Ant, Graph) =>
    Ant(currentNode => prevNodes => _ =>
        updateGraph(updatePheronome(p, rate), R.last(prevNodes), currentNode, Graph)));

/**
 * move :: Number -> Number -> Number -> Number -> [Ant] -> Graph -> ([Ant] -> Graph -> a) -> a
 */
const move = R.curry((q, B, p, rate, ants, Graph, f) =>
    R.pipe(
        _ => ants.reduce(({ updatedAnts, Graph }, Ant, i) =>
            R.pipe(
                _ => updateAnt(pickNextEdge(q, B, Ant, Graph), Ant),
                updatedAnt => ({
                    updatedAnts: [...updatedAnts, updatedAnt],
                    Graph: dropPhero(p, rate, updatedAnt, Graph)
                })
            )(), { updatedAnts: [], Graph: Graph }),
        o => f(o.updatedAnts)(o.Graph)
    )());

/**
 * completeTour :: Number -> Number -> Number -> Number -> [Ant] -> Graph -> ([Ant] -> Graph -> a)
 */
const completeTour = R.curry((q, B, p, rate, ants, Graph, f) =>
    R.all(Ant => getPreviousNodes(Ant).length === nodesNumber(Graph))(ants) ? f(ants)(despositGlobalPhero(p, rate, getBestAnt(ants), Graph)) :
        move(q, B, p, rate, ants, Graph,
            updatedAnts => updatedGraph => completeTour(q, B, p, rate, updatedAnts, updatedGraph, f)));

module.exports = {
    placeAnts,
    completeTour
};