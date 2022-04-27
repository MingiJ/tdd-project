const assert = require("assert");
const Money = require("./money");
const Portfolio = require("./portfolio");
const Bank = require("./bank");

class MoneyTest {
  constructor(){
    this.bank = new Bank();
    this.bank.addExchangeRate("EUR", "USD", 1.2);
    this.bank.addExchangeRate("USD", "KRW", 1100);
  }
  testMultiplication() {
    let tenEuros = new Money(10, "EUR");
    let twentyEuros = new Money(20, "EUR");
    assert.deepStrictEqual(tenEuros.times(2), twentyEuros);
  }
  testDivision() {
    let originalMoney = new Money(4002, "KRW");
    let actualMoneyAfterDivision = originalMoney.divide(4);
    let expectedMoneyAfterDivision = new Money(1000.5, "KRW");
    assert.deepStrictEqual(
      actualMoneyAfterDivision,
      expectedMoneyAfterDivision
    );
  }
  testAddition() {
    let fiveDollars = new Money(5, "USD");
    let tenDollars = new Money(10, "USD");
    let fifteenDolllars = new Money(15, "USD");
    let portfolio = new Portfolio();
    let bank = new Bank();
    portfolio.add(fiveDollars, tenDollars);
    assert.deepStrictEqual(portfolio.evaluate(bank, "USD"), fifteenDolllars);
  }
  testAdditionOfDollarsAndEuros() {
    let fiveDollars = new Money(5, "USD");
    let tenEuros = new Money(10, "EUR");
    let portfolio = new Portfolio();
    portfolio.add(fiveDollars, tenEuros);
    let expectedValue = new Money(17, "USD");
    assert.deepStrictEqual(portfolio.evaluate(this.bank,"USD"), expectedValue);
  }
  testConversion() {
    let bank = this.bank;
    bank.addExchangeRate("EUR", "USD", 1.2);
    let tenEuros = new Money(10, "EUR");
    assert.deepStrictEqual(bank.convert(tenEuros, "USD"), new Money(12, "USD"));
  }

  testConversionWithMissingExchangeRate(){
    let tenEuros = new Money(10, "EUR");
    let expectedError = new Error("EUR->Kalganid");
    let portfolio = new Portfolio();
    portfolio.add(tenEuros);
    assert.throws(()=>portfolio.evaluate(this.bank,"Kalganid"), expectedError);
  }
  runAllTests() {
    let testMethods = this.getAllTestMethods();
    testMethods.forEach((m) => {
      console.log("Running %s()", m);
      let method = Reflect.get(this, m);
      try {
        Reflect.apply(method, this, []);
      } catch (e) {
        if (e instanceof assert.AssertionError) {
          console.log(e);
        } else {
          throw e;
        }
      }
    });
  }
  getAllTestMethods() {
    let moneyPrototype = MoneyTest.prototype;
    let allProps = Object.getOwnPropertyNames(moneyPrototype);
    let testMethods = allProps.filter((p) => {
      return typeof moneyPrototype[p] === "function" && p.startsWith("test");
    });
    return testMethods;
  }
}

new MoneyTest().runAllTests();
