const PRODUCTS = require('./products');
const pricingRules = require('./rules');

let Basket = function (pricing_rules) {

    // set up
    this.sub_total = 0;
    this.items = [];

    this.getItem = function (code) {
        let item = PRODUCTS[code];
        // extend item with product code
        if (item) {
            return {
                ...item,
                code: code
            }
        } else {
            // TODO (out of scope) throw error if product not in stock
            return;
        }
    }

    this.add = function (code) {
        const item = this.getItem(code);
        if (item) {
            this.sub_total += item.price;
            this.items.push(item);
        }
    }

    this.getSimilarItems = function (item_code) {
        return this.items.filter(item => item.code === item_code);
    }
    this.getQuantityOfProduct = function (item_code) {
        const same_items = this.getSimilarItems(item_code);
        return same_items.length || 0;
    }

    this.getNumOfDiscountsForItem = function (item_code) {
        // does a rule exist for this item?
        const rule = pricingRules[item_code];

        let qualifying_quantity = 0;

        if (rule) {
            // does the number of items activate the rule?
            const quantity = this.getQuantityOfProduct(item_code);

            // mutiple qualifying purchases for same product?
            if (quantity >= rule.qualifying_quantity) {
                qualifying_quantity = quantity - (quantity % rule.qualifying_quantity);
                // TODO - (out of scope) This method allows a prompt
                // on the checkout to purchase additional items to 
                // qualify for another offer
            }
        }

        return qualifying_quantity;
    }

    this.getUniqueProductsInBasket = function () {
        // return a list of items with unique codes
        return [...new Set(this.items.map(item => item.code))];
    }

    this.applyPriceRules = function () {
        // get list of unique products in basket (to check codes)
        const unique_product_codes = this.getUniqueProductsInBasket();

        // for each product, check if pricing rule applies
        unique_product_codes.forEach(code => {
            const num_of_qualifying_items = this.getNumOfDiscountsForItem(code);
            if (num_of_qualifying_items) {
                this.applyDiscountToProducts(code, num_of_qualifying_items);
            }
        });

    }

    this.applyDiscountToProducts = function (item_code, num_of_qualifying_items) {
        // get rule for item
        const RULE = pricingRules[item_code];
        const new_prices = RULE.prices_per_unit_after_discount;

        let items_updated = 0;
        let new_price_idx = 0;

        this.items.forEach(item => {
            if (item.code === item_code && items_updated < num_of_qualifying_items) {
                const replacement_price = new_prices[new_price_idx];

                item.price_after_discount = replacement_price === undefined ? item.price : replacement_price;

                // if looping multiple similar offers, reset index
                new_price_idx = new_price_idx < new_prices.length - 1 ? new_price_idx + 1 : 0;
                items_updated++;
            }
        });
    }

    this.getTotalWithDiscounts = function () {
        const total_after_discounts = this.items.reduce((total, item) => {
            // use RRP if no discounted price (undefined)
            let price = item.price;
            if (item.price_after_discount !== undefined) {
                price = item.price_after_discount;
            }
            return total + price;
        }, 0);
        return total_after_discounts;
    }

    this.formatPrice = function (n) {
        return Number(n.toFixed(2))
    }

    this.total = function () {
        // apply rules
        this.applyPriceRules();

        const total = this.getTotalWithDiscounts();

        return this.formatPrice(total);
    }
}

module.exports = Basket;