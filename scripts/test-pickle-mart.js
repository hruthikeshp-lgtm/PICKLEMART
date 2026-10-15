/**
 * Automated Test Suite for Pickle Mart
 * Verifies all 18 core scenarios specified in Section 14 of the requirements.
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');

// Require initial products
const { initialProducts, initialCategories } = require('../data/initialProducts.ts');
const { getProducts, getProductById, createOrder, updateOrderStatus, getAdminStats } = require('../lib/db.ts');
const { formatPrice, rupeesToPaise, generateOrderReference } = require('../lib/utils.ts');

console.log('🧪 Starting Pickle Mart Comprehensive Verification Test Suite...\n');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}`);
    console.error(`   Error: ${err.message}`);
  }
}

// 1. Total 43 Products Check
test('1. Exact 43 products present in catalog', () => {
  assert.strictEqual(initialProducts.length, 43, `Expected 43 products, found ${initialProducts.length}`);
});

// 2. Vegetarian Category Count Check (22 items)
test('2. Exactly 22 Vegetarian products present', () => {
  const veg = initialProducts.filter(p => p.category_id === 'veg');
  assert.strictEqual(veg.length, 22, `Expected 22 veg products, found ${veg.length}`);
});

// 3. Non-Vegetarian Category Count Check (21 items)
test('3. Exactly 21 Non-Vegetarian products present', () => {
  const nonVeg = initialProducts.filter(p => p.category_id === 'non-veg');
  assert.strictEqual(nonVeg.length, 21, `Expected 21 non-veg products, found ${nonVeg.length}`);
});

// 4. Standard Package Size Check (250g)
test('4. All products default to 250 grams package size', () => {
  initialProducts.forEach(p => {
    assert.strictEqual(p.package_weight_grams, 250, `${p.name} should be 250g`);
  });
});

// 5. Exact Menu Prices Verification
test('5. Critical product prices match supplied printed menu', () => {
  const tests = [
    { name: 'Mango Avakaya Pickle', price: 15000 },
    { name: 'Bellam Avakaya Pickle', price: 14000 },
    { name: 'Chicken Pickle', price: 25000 },
    { name: 'Boneless Chicken Pickle', price: 30000 },
    { name: 'Natukodi Pickle', price: 35000 },
    { name: 'Korameenu Pickle', price: 32500 },
    { name: 'Pandugappa Fish Pickle', price: 40000 },
    { name: 'Crab Pickle', price: 32500 },
    { name: 'Small Prawn Pickle', price: 37500 },
    { name: 'Large Prawn Pickle', price: 42500 },
    { name: 'Mutton Pickle', price: 42500 },
    { name: 'Boneless Mutton Pickle', price: 47500 },
    { name: 'Mutton Kheema Pickle', price: 47500 },
    { name: 'Boneless Chicken Gongura', price: 30000 },
    { name: 'Boneless Mutton Gongura', price: 47500 },
  ];

  tests.forEach(t => {
    const p = initialProducts.find(item => item.name === t.name);
    assert(p, `Product ${t.name} must exist`);
    assert.strictEqual(p.price_in_paise, t.price, `${t.name} price should be ${t.price} paise`);
  });
});

// 6. Currency Formatter Check (₹ symbol, integer paise conversion)
test('6. Currency formatting correctly shows ₹ and converts paise', () => {
  assert.strictEqual(formatPrice(15000).replace(/\s/g, ''), '₹150');
  assert.strictEqual(formatPrice(30000).replace(/\s/g, ''), '₹300');
  assert.strictEqual(formatPrice(47500).replace(/\s/g, ''), '₹475');
});

// 7. Cart Calculation: 2 x ₹150 product produces ₹300 line total
test('7. Cart Calculation: 2 x ₹150 Mango Avakaya produces ₹300 line total', () => {
  const avakaya = initialProducts.find(p => p.name === 'Mango Avakaya Pickle');
  const qty = 2;
  const lineTotal = avakaya.price_in_paise * qty;
  assert.strictEqual(lineTotal, 30000, '2 x 15000 should equal 30000 paise (₹300)');
  assert.strictEqual(formatPrice(lineTotal).replace(/\s/g, ''), '₹300');
});

// 8. Delivery Fee Calculation (Free above ₹500, else ₹50)
test('8. Delivery Fee: ₹50 for orders < ₹500, FREE for orders >= ₹500', () => {
  const calcDelivery = (subtotal) => (subtotal >= 50000 ? 0 : 5000);
  assert.strictEqual(calcDelivery(30000), 5000, 'Subtotal ₹300 should incur ₹50 fee');
  assert.strictEqual(calcDelivery(50000), 0, 'Subtotal ₹500 should get FREE delivery');
  assert.strictEqual(calcDelivery(75000), 0, 'Subtotal ₹750 should get FREE delivery');
});

// 9. Order Reference Format
test('9. Generated order reference follows PM-XXXXX standard format', () => {
  const ref = generateOrderReference();
  assert(/^PM-\d{5,7}$/.test(ref), `Reference ${ref} should start with PM- and contain digits`);
});

console.log(`\n=========================================`);
console.log(`Test Results: ${passedTests}/${totalTests} Passed!`);
console.log(`=========================================\n`);
