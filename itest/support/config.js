fs = require('fs')

var ITestConfig = {

  load: function () {
    //TODO this needs to move to the ~./.config/blockchyp/sdk-itest-config.json convention
    var data = fs.readFileSync('/etc/blockchyp/sdk-itest-config.json');
    ITestConfig.config = JSON.parse(data)

  },

  getGatewayHost: function () {
    return ITestConfig.config.gatewayHost
  },

  getTestGatewayHost: function () {
    return ITestConfig.config.testGatewayHost
  },

  getTokenizingKey: function () {
    return ITestConfig.config.tokenizingKey
  }

};

module.exports = {

  config: ITestConfig

}
