const Console = require('../logger')
let e2e = require('recheck-clientjs-library')
var aes256 = require('aes256')

// eslint-disable-next-line
var wallet = null
var keyPair = null

let baseHost = window.location.hostname
let basePort = window.location.port
let apiUrl = window.location.protocol + '//' + baseHost + ':' + basePort
    apiUrl = process.env.NODE_ENV;
//  apiUrl = 'https://beta.recheck.io'


export default {
  setURLandNetwork: function(apiUrl, network){
    e2e.init(apiUrl, network);
  },

  init: async function (password) {
    Console.log('init')
    e2e.init(apiUrl)
    console.log("ei tvaaaaaaaaaaaaaaaaaaaa" + apiUrl);
    
    if (!localStorage.walletAe1) {
      Console.log('Wallet does not exist yet. Will create one.')
      keyPair = await e2e.newKeyPair(null)
      wallet = JSON.stringify(keyPair)
      Console.log('Wallet created with account', keyPair)
      this.saveWallet(keyPair, password)
      Console.log('Wallet saved.')
    } else {
      Console.log('wallet account exists')
    }
    return wallet
  },

  pinned: function() {
    var privateKey = localStorage.walletAe1
    if (typeof privateKey === 'undefined') return false
    Console.log('pinned: privateKey =', privateKey)
    var storedSha3 = localStorage.walletSha3Ae
    Console.log('pinned: storedSha3 =', storedSha3)
    Console.log('pinned: typeof storedSha3 === undefined =', (typeof storedSha3 === 'undefined'))
    var computedSha3 = e2e.getHash(privateKey)
    Console.log('pinned: computedSha3 =', computedSha3)
    Console.log('pinned: (computedSha3 !== storedSha3) =', (computedSha3 !== storedSha3))
    if (typeof storedSha3 === 'undefined') return false
    return (computedSha3 !== storedSha3) 
  },

  checkPassword: function(password) {
    Console.log('password', password)
    return e2e.getHash(aes256.decrypt(password, localStorage.walletAe1)) === localStorage.walletSha3Ae
  },

  saveWallet: function (keyPair, password) {
    let keyPairStr = JSON.stringify(keyPair)
    Console.log('saveWallet with password', password)
    localStorage.walletSha3Ae = e2e.getHash(keyPairStr)
    var encrypted = aes256.encrypt(password, keyPairStr)
    Console.log('encrypted private key', encrypted)
    localStorage.walletAe1 = encrypted // web3.eth.accounts.wallet.accounts[0].privateKey // encrypt wallet
    localStorage.publicAddress = keyPair.address
    this.resetWallet()
  },

  resetWallet: function() {
    wallet = null
    keyPair = null
  },

  loadWallet: function (password) {
    if (!this.checkPassword(password)) {
      return 'authError'
    }
    var encrypted = localStorage.walletAe1
    if (typeof encrypted === 'undefined') return encrypted
    var account = aes256.decrypt(password, encrypted) // decrypt encrypted
    this.resetWallet()
    Console.log('loaded private key: ' + encrypted)
    wallet = account
    keyPair = JSON.parse(account)
    localStorage.publicAddress = keyPair.address
    localStorage.walletSha3Ae = e2e.getHash(account)
    return true
  },

  resetPIN(oldPass, newPass){
    if (!this.checkPassword(oldPass)) {
      return false
    }
    let encrypted = localStorage.walletAe1
    if (typeof encrypted === 'undefined') return encrypted
    let account = aes256.decrypt(oldPass, encrypted) // decrypt encrypted
    Console.log('loaded private key: ' + encrypted)
    wallet = account
    keyPair = JSON.parse(account)

    let keyPairStr = JSON.stringify(keyPair)
    Console.log('saveWallet with password', newPass)
    localStorage.walletSha3Ae = e2e.getHash(keyPairStr)
    encrypted = aes256.encrypt(newPass, keyPairStr)
    Console.log('encrypted private key', encrypted)
    localStorage.walletAe1 = encrypted // web3.eth.accounts.wallet.accounts[0].privateKey // encrypt wallet
    localStorage.publicAddress = keyPair.address
    this.resetWallet()
    return true
  },

  importPrivateKey: async function (password, phrase) {
    if (!this.checkPassword(password)) {
      return 'authError'
    }
    this.resetWallet()
    keyPair = await e2e.newKeyPair(phrase)
    wallet = JSON.stringify(keyPair)
    this.saveWallet(keyPair, password)
    return true
  },

  doLogin: async function (password, _challenge, callback) {
    Console.log('pass', password)

    if (!this.checkPassword(password)) {
      callback('authError');      
      return 'authError'
    } else {
      this.loadWallet(password)
    } 

    var challenge = _challenge.substring(_challenge.lastIndexOf('/') + 1, _challenge.length)    
    Console.log('challenge', challenge)
    try {
      let token = await e2e.loginWithChallenge(challenge, keyPair)
      localStorage.lastRtnToken = token
      Console.log(token)
      callback(false)
    } catch(error) {
      Console.error(error);
      callback(error)
    }
    this.resetWallet()
    return true
  },

  doExecSelection: async function (password, _selection, callback) {
    Console.log('pass', password)

    if (!this.checkPassword(password)) {
      callback('authError');      
      return 'authError'
    } else {
      this.loadWallet(password)
    } 

    try {
      await e2e.login(keyPair)
      console.log("toz keypair", keyPair);
      
      let token = await e2e.execSelection(_selection, keyPair)
      Console.log(token)
      callback(false)
    } catch(error) {
      Console.error(error);
      callback(error)
    }
    this.resetWallet()
    return true
  },

  privateKey: function () {
    return wallet
  },

  wallet() {
    return keyPair
  },
}