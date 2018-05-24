const R = require('ramda');
const math = require('mathjs');

/**Returns index of chosen probability
 * 
 * rouletteWheele :: [Number] -> Number
 */
const rouletteWheele = probabilities =>
    R.pipe(
        R.map(n => n * 100),
        wheele => R.pipe(
            _ => math.randomInt(0, 100),
            r => wheele.reduce((N, n, i) => 
                typeof N === 'object' ? N : N + n > r ? {index: i} : N + n, 0),
            o => o.index
        )()
    )(probabilities);

module.exports = {
    rouletteWheele
};