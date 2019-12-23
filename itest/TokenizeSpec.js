describe("TokenizerTest", function() {
  var Tokenizer = require('../dist/tokenizer.js').default;

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  });

  it("Should Tokenize Payment Method", function(done) {

    var Config = require('../itest/support/config').config;
    Config.load();
    Tokenizer.setGatewayHost(Config.getGatewayHost())
    Tokenizer.setTestGatewayHost(Config.getTestGatewayHost())


    let request = {
      test: true,
      pan: "4111111111111111",
      expMonth: "12",
      expYear: "25",
      cvv: "123",
      postalCode: "64117"
    }

    Tokenizer.tokenize(Config.getTokenizingKey(), request)
      .then(function (response) {
        let hb = response.data
        console.log(hb)
        expect(hb.success).toBe(true);
        expect(hb.token).toBeDefined();
        expect(hb.maskedPan).toBeDefined();
        expect(hb.paymentType).toBe('VISA');
        expect(hb.entryMethod).toBeDefined();
        expect(hb.transactionId).toBeDefined();
        done()
      })
      .catch(function (error) {
        console.log("Error:", error)
        done()
      })
  });

});
