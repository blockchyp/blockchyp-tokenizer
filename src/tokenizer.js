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

  render (tokenizingKey, test, divId, options) {
    var inputDiv = document.getElementById(divId)
    inputDiv.setAttribute('style', 'margin: 0; padding: 0;')
    var bcFrame = document.createElement('iframe')
    bcFrame.setAttribute('style', 'margin: 0; padding: 0;')
    bcFrame.setAttribute('id', 'blockchypSecureInput')
    bcFrame.setAttribute('frameBorder', '0')
    bcFrame.setAttribute('scrolling', 'false')
    bcFrame.setAttribute('width', '100%')
    if ((options) && (options.height)) {
      bcFrame.setAttribute('height', options.height)
    } else {
      bcFrame.setAttribute('height', '36px')
    }
    if (test) {
      bcFrame.setAttribute('src', this.testGatewayHost + '/secure-input?key=' + tokenizingKey)
    } else {
      bcFrame.setAttribute('src', this.gatewayHost + '/secure-input?key=' + tokenizingKey)
    }
    inputDiv.appendChild(bcFrame)
  }

  tokenize (tokenizingKey, request) {
    let url = ''
    let self = this
    if (request.test) {
      url = self.testGatewayHost
    } else {
      url = self.gatewayHost
    }
    if (document.getElementById('blockchypSecureInput')) {
      if (!request['transactionRef']) {
        request['transactionRef'] = Math.random().toString(36).substring(2, 15)
      }
      var promise = new Promise(function (resolve, reject) {
        window.addEventListener('message', function (event) {
          console.log('Response: ' + JSON.stringify(event))
          resolve(event)
        })
      })
      request['origin'] = window.location.href
      window.addEventListener('message', this.handleTokenizationResponse)
      document.getElementById('blockchypSecureInput').contentWindow.postMessage(request, url)
      return promise
    } else {
      url = url + '/api/tokenize'
      return axios.post(url, request, self._getGatewayConfig(tokenizingKey))
    }
  }
}

var Tokenizer = new BlockChypTokenizer()
export default Tokenizer
