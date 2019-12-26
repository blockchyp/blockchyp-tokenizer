import axios from 'axios'
import { Base64 } from 'js-base64'

class BlockChypTokenizer {
  constructor () {
    this.gatewayHost = 'https://api.blockchyp.com'
    this.testGatewayHost = 'https://test.blockchyp.com'
    this.defaultTimeout = 60
    this.inputDiv = null
    this.valid = false
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

  isValid () {
    return this.valid
  }

  render (tokenizingKey, test, divId, options) {
    let self = this
    this.inputDiv = divId
    var inputDiv = document.getElementById(divId)
    inputDiv.setAttribute('style', 'margin: 0; padding: 0;')
    var bcFrame = document.createElement('iframe')
    bcFrame.setAttribute('style', 'margin: 0; padding: 0;')
    bcFrame.setAttribute('id', 'blockchypSecureInput')
    bcFrame.setAttribute('frameBorder', '0')
    bcFrame.setAttribute('scrolling', 'no')
    bcFrame.setAttribute('width', '100%')
    if ((options) && (options.height)) {
      bcFrame.setAttribute('height', options.height)
    } else {
      bcFrame.setAttribute('height', '36px')
    }

    var src = ''

    if (test) {
      src = this.testGatewayHost
    } else {
      src = this.gatewayHost
    }
    src = src + '/secure-input?key=' + tokenizingKey
    src = src + '&origin=' + encodeURI(window.location.href)

    if (options) {
      // encode options
      var optionsEncoded = Base64.encode(JSON.stringify(options))
      src = src + '&options=' + optionsEncoded
    }
    bcFrame.setAttribute('src', src)
    inputDiv.appendChild(bcFrame)
    if (document.getElementById(divId + '-error')) {
      var errorDiv = document.getElementById(divId + '-error')
      errorDiv.style.display = 'none'
    }
    window.addEventListener('message', function (event) {
      if (event.data['message']) {
        switch (event.data['message']) {
          case 'validate':
            var inputDiv = document.getElementById(divId)
            var errorDiv = document.getElementById(self.inputDiv + '-error')
            if (event.data['valid']) {
              self.valid = true
              inputDiv.style['border-color'] = null
              errorDiv.style.display = 'none'
            } else {
              self.valid = false
              inputDiv.style['border-color'] = 'red'
              errorDiv.style.display = 'block'
              errorDiv.innerText = event.data.error
            }
        }
      }
    })
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
      var errorDiv = document.getElementById(self.inputDiv + '-error')
      errorDiv.style.display = 'none'
      var promise = new Promise(function (resolve, reject) {
        window.addEventListener('message', function (event) {
          if (!event.data['message']) {
            console.log('Response: ' + JSON.stringify(event))
            if (!event.data.success) {
              if (document.getElementById(self.inputDiv + '-error')) {
                var errorDiv = document.getElementById(self.inputDiv + '-error')
                errorDiv.style.display = 'block'
                errorDiv.innerText = event.data.responseDescription
              }
            }
            resolve(event)
          }
        })
        request['origin'] = window.location.href
        document.getElementById('blockchypSecureInput').contentWindow.postMessage(request, url)
      })
      return promise
    } else {
      url = url + '/api/tokenize'
      return axios.post(url, request, self._getGatewayConfig(tokenizingKey))
    }
  }
}

var Tokenizer = new BlockChypTokenizer()
export default Tokenizer
