const R = require('ramda');
const math = require('mathjs');

/**
 * makePercentages :: [Number] -> [Number]
 */
const makePercentages = numbers => numbers.map(n => n === 0 ? 0 : (n / R.sum(numbers) * 100));

/**Returns index of chosen probability
 * 
 * rouletteWheele :: [Number] -> Number
 */
const rouletteWheele = probabilities => R.all(R.equals(0), probabilities) ? math.randomInt(0, probabilities.length) :
    R.pipe(
        makePercentages,
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