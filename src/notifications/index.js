const config = require('./config');
const firebase = require('firebase/app')
const Console = require('../logger')
require('firebase/messaging')

module.exports = {
  init: function (callback) {
    firebase.initializeApp(config.credentials)
    var messaging = firebase.messaging()
    navigator.serviceWorker.register('firebase-messaging-sw.js')
    .then((registration) => {
      messaging.useServiceWorker(registration);
      messaging.requestPermission()
      .then(() => {
        Console.log('Messaing permission granted.')
        return messaging.getToken()
      })
      .then((token) => {
        Console.log('Firebase token', token)
        callback(null, token)
        return
      })
      .catch((err) => {
        Console.log('Messsaging permissions DENIED!', err)
        callback(err, err)
        return
      })
    });
    return messaging    
  },
  
  onMessage: function(messaging, handler) {
    messaging.onMessage(function(payload) {
      Console.log('onMessage:', payload)
      handler(payload)
      return
    })
  }
}
