// build rule engine to be universal and self contained
const pricingRules = {
    'FR1': {
        code: 'BOGOF',
        qualifying_quantity: 2,
        prices_per_unit_after_discount: [undefined, 0]
    },
    'SR1': {
        code: 'MULTIBUY3',
        qualifying_quantity: 3,
        prices_per_unit_after_discount: [4.5, 4.5, 4.5]
    }
}

module.exports = pricingRules;