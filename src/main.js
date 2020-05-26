import Vue from 'vue'
import './plugins/vuetify'
import App from './App'
import './plugins/vuetify'
import router from './router'
import VueQrcodeReader from 'vue-qrcode-reader'
import chain from './chain'
// import './registerServiceWorker'
import Console from './logger'
var SocialSharing = require('vue-social-sharing');

import {store} from './store/store.js'

var notifier;

Vue.use(SocialSharing);

(async () => {
  var userAgent = window.navigator.userAgent;
  if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
    Console.log('Safari Mobile')
  } else {
    notifier = require('./notifications')  
  }

  process.versions = {node: '11.2.0'}

  Vue.config.productionTip = true

  Vue.use(VueQrcodeReader)

  /* eslint-disable no-new */
  new Vue({
    render: h => h(App),
    router,
    store,
    data () {
      return {
        lastCheckTick : 0
      }
    },
    methods : {
      checkShares(t) {
        if (Date.now() - t.lastCheckTick > 30000) {
          chain.doCheckShares(function (err, message) {
            if (!err) {
              if (message != null) {
                t.lastCheckTick = Date.now()
                t.$root.$emit('error_on', message, 'blue')  
                t.$root.$emit('badge_on')
              } else {
                t.lastCheckTick = 0
                t.$root.$emit('badge_off')
              }
            } else {
                t.lastCheckTick = Date.now() + 30000
                t.v.$root.$emit('error_on', message, 'red')
            }      
          })
        }
      },
      initMessaging() {
        var userAgent = window.navigator.userAgent;
        if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
          // iPad or iPhone
        } else {
          var messaging = notifier.init((err, token) => {
            if (!err) {
              localStorage.lastFirebaseToken = token
              Console.log('Set localStorage.lastFirebaseToken to', token)
            } else {
              Console.log('Push notifications are disabled')
              this.$root.$emit('error_on', 'Push notifications disabled.', 'red')
            }
          })
          notifier.onMessage(messaging, (payload) => {
            this.$root.$emit('error_on', payload.data.body, 'blue')
          })
        }
      },
      checkPinned() {
        var appPath = window.location.pathname
        Console.log('Current app URL is', appPath)
        var isChallengeUrl = false
        let uri = window.location.search.substring(1); 
        let params = new URLSearchParams(uri);
        isChallengeUrl = params.get('c')
        let environment = process.env.NODE_ENV.split(",")
        let apiUrl = environment[0]
        Console.log('isChallengeUrl', isChallengeUrl)
        Console.log('apiUrl', apiUrl)
        let urlChallenge = ''; 
        if (isChallengeUrl) urlChallenge =  apiUrl + '/login/' + isChallengeUrl
        if (!chain.pinned()) {
          if (isChallengeUrl) {
            router.push({ name: 'AppIdentity', params: { challenge: urlChallenge } })
          } else {
            router.push('/identity')
          }
        } else if (isChallengeUrl) {
          router.push({ name: 'AppCamera', params: { omitCamera: true, challenge: urlChallenge } })
        }
      }
    },
    mounted () {
      this.initMessaging()
      this.checkPinned()
    }
  }).$mount('#app')
})()
