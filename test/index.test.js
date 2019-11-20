const expect = require('chai').expect;
const should = require('chai').should();

const Basket = require('../src/js/index');

let basket;

// mock stock
const PRODUCTS = {
    'FR1': {
        name: 'Fruit tea',
        price: 3.11
    },
    'SR1': {
        name: 'Strawberries',
        price: 5.00
    },
    'CF1': {
        name: 'Coffee',
        price: 11.23
    }
}

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

beforeEach(() => {
    basket = new Basket(pricingRules);
});

////////////// UNIT & INTEGRATION TESTS

describe("Check basket is empty to start with", function () {
    it("should have a total of 0 to start with and no items", function () {
        basket.should.have.property('sub_total').equal(0);
        expect(basket.items).to.have.lengthOf(0);
        expect(basket.total()).to.equal(0);
    });
});

describe("Check can add an item, add()", function () {

    it("should have one item in basket", function () {
        basket.add('FR1');
        expect(basket.items).to.have.lengthOf(1);
        expect(basket.total()).to.equal(3.11);
    });

    it("should have two items in basket", function () {
        basket.add('FR1');
        expect(basket.items).to.have.lengthOf(1);
        expect(basket.total()).to.equal(3.11);

        basket.add('SR1');
        expect(basket.items).to.have.lengthOf(2);
        expect(basket.total()).to.equal(8.11);
    });
});

describe("Check can return all similar items, getSimilarItems()", function () {

    it("should return similar items only", function () {
        basket.add('FR1');
        basket.add('FR1');
        basket.add('SR1');
        expect(basket.getSimilarItems('FR1')).to.have.lengthOf(2);
    });
});


describe("Check can return all similar items, getUniqueProductsInBasket()", function () {

    it("should return an array of unique products", function () {
        basket.add('FR1');
        basket.add('FR1');
        basket.add('SR1');
        basket.add('SR1');
        basket.add('CF1');
        expect(basket.getUniqueProductsInBasket()).to.have.lengthOf(3);
        expect(basket.getUniqueProductsInBasket()).to.eql(['FR1', 'SR1', 'CF1']);
    });
});



describe("Integration test to check adding products", function () {

    it("should increment total without any pricing rule matches", function () {
        basket.add('FR1');
        expect(basket.items).to.have.lengthOf(1);
        expect(basket.getQuantityOfProduct('FR1')).to.equal(1);
        basket.should.have.property('sub_total').equal(3.11);
        expect(basket.total()).to.equal(3.11);

        basket.add('SR1');
        expect(basket.items).to.have.lengthOf(2);
        expect(basket.getQuantityOfProduct('SR1')).to.equal(1);
        basket.should.have.property('sub_total').equal(8.11);
        expect(basket.total()).to.equal(8.11);

        basket.add('CF1');
        expect(basket.items).to.have.lengthOf(3);
        expect(basket.getQuantityOfProduct('CF1')).to.equal(1);
        basket.should.have.property('sub_total').equal(19.34);
        expect(basket.total()).to.equal(19.34);

    });

    it("should activate pricing rule: BOGOF", function () {
        basket.add('FR1');
        expect(basket.items).to.have.lengthOf(1);
        expect(basket.getQuantityOfProduct('FR1')).to.equal(1);
        basket.should.have.property('sub_total').equal(3.11);
        expect(basket.total()).to.equal(3.11);

        basket.add('FR1');
        expect(basket.items).to.have.lengthOf(2);
        expect(basket.getQuantityOfProduct('FR1')).to.equal(2);
        basket.should.have.property('sub_total').equal(6.22);
        expect(basket.total()).to.equal(3.11);

        basket.add('FR1');
        expect(basket.items).to.have.lengthOf(3);
        expect(basket.getQuantityOfProduct('FR1')).to.equal(3);
        basket.should.have.property('sub_total').equal(9.33);
        expect(basket.total()).to.equal(6.22);

    });

    it("should activate pricing rule: MULTIBUY3", function () {
        basket.add('SR1');
        expect(basket.items).to.have.lengthOf(1);
        expect(basket.getQuantityOfProduct('SR1')).to.equal(1);
        basket.should.have.property('sub_total').equal(5.00);
        expect(basket.total()).to.equal(5.00);

        basket.add('SR1');
        expect(basket.items).to.have.lengthOf(2);
        expect(basket.getQuantityOfProduct('SR1')).to.equal(2);
        basket.should.have.property('sub_total').equal(10.00);
        expect(basket.total()).to.equal(10.00);

        basket.add('SR1');
        expect(basket.items).to.have.lengthOf(3);
        expect(basket.getQuantityOfProduct('SR1')).to.equal(3);
        basket.should.have.property('sub_total').equal(15);
        expect(basket.total()).to.equal(13.50);

    });


});


describe("Checks multiple pricing rules applied to same product", () => {

    it("should apply 2 BOGOF rules and keep one RRP", () => {
        basket.add('FR1');
        basket.add('FR1');
        basket.add('FR1');
        basket.add('FR1');
        basket.add('FR1');
        expect(basket.total()).to.equal(9.33);
    });

    it("should apply 2 MULTIBUY3 rules and keep one RRP", () => {
        basket.add('SR1');
        basket.add('SR1');
        basket.add('SR1');
        basket.add('SR1');
        basket.add('SR1');
        basket.add('SR1');
        basket.add('SR1');
        expect(basket.total()).to.equal(32.00);
    });
});


///////// SPECIFIC TESTS FOR CODING CHALLENGE
describe("Calculate specific baskets scenarios", () => {

    it("should apply relevant pricing rules, example 1", () => {
        basket.add('FR1');
        basket.add('SR1');
        basket.add('FR1');
        basket.add('CF1');
        expect(basket.total()).to.equal(19.34);
    });

    it("should apply relevant pricing rules, example 2", () => {
        basket.add('FR1');
        basket.add('FR1');
        expect(basket.total()).to.equal(3.11);
    });

    it("should apply relevant pricing rules, example 3", () => {
        basket.add('SR1');
        basket.add('SR1');
        basket.add('FR1');
        basket.add('SR1');
        expect(basket.total()).to.equal(16.61);
    });
});
