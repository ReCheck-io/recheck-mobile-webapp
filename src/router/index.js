import Vue from 'vue'
import Router from 'vue-router'
import AppHome from '@/components/AppHome'

// with the const path 400 kb are saved

const AppCamera = resolve => {
  require.ensure(['@/components/AppCamera'], () => {
    resolve(require('@/components/AppCamera'))
  });
}
const AppIdentity = resolve => {
  require.ensure(['@/components/AppIdentity'], () => {
    resolve(require('@/components/AppIdentity'))
  });
}
const Help = resolve => {
  require.ensure(['@/components/infoPages/Help'], () => {
    resolve(require('@/components/infoPages/Help'))
  });
}
const TermsAndPrivacy = resolve => {
  require.ensure(['@/components/infoPages/Privacy'], () => {
    resolve(require('@/components/infoPages/Privacy'))
  });
}
const AppSecuritySettings = resolve => {
  require.ensure(['@/components/AppSecuritySettings'], () => {
    resolve(require('@/components/AppSecuritySettings'))
  });
}

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'AppHome',
      default: false,
      component: AppHome
    },
    {
      path: '/scan',
      name: 'AppCamera',
      component: AppCamera
    },
    {
      path: '/identity',
      name: 'AppIdentity',
      default: true,
      component: AppIdentity
    },    
    {
      path: '/securitysettings',
      name: 'AppSecuritySettings',
      default: true,
      component: AppSecuritySettings
    },
    {
      path: '/help',
      name: 'Help',
      default: true,
      component: Help
    },
    {
      path: '/privacy',
      name: 'Privacy',
      default: true,
      component: TermsAndPrivacy
    },
    {
      path: '*',
      redirect: '/'
    }
  ],
  // eslint-disable-next-line
  scrollBehavior(to, from, savedPosition) {
    return {
      x: 0,
      y: 0
    }
  }
})