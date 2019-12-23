import axios from 'axios'

class BlockChypTokenizer {
  constructor () {
    this.gatewayHost = 'https://api.blockchyp.com'
    this.testGatewayHost = 'https://test.blockchyp.com'
    this.defaultTimeout = 60
  }

  setGatewayHost (host) {
    this.gatewayHost = host
  }

  setTestGatewayHost (host) {
    this.testGatewayHost = host
  }

  _getGatewayConfig (tokenizingKey) {
    let config = {}
    config['headers'] = {
      'Authorization': 'Tokenizing-Key ' + tokenizingKey
    }
    return config
  }

  enhance (inputId) {

  }

  render (divId) {

  }

  tokenize (tokenizingKey, request) {
    let url = ''
    let self = this
    if (request.test) {
      url = self.testGatewayHost
    } else {
      url = self.gatewayHost
    }
    url = url + '/api/tokenize'
    return axios.post(url, request, self._getGatewayConfig(tokenizingKey))
  }
}

var Tokenizer = new BlockChypTokenizer()
export default Tokenizer
