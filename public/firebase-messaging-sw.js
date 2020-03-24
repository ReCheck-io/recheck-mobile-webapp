importScripts('https://www.gstatic.com/firebasejs/5.9.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/5.9.0/firebase-messaging.js')

const credentials = {
  apiKey: "AIzaSyCKknKUEPJ7rNo0QLWvHdDPFmLPmIjnSsM",
  authDomain: "recheck-documents.firebaseapp.com",
  databaseURL: "https://recheck-documents.firebaseio.com",
  projectId: "recheck-documents",
  storageBucket: "recheck-documents.appspot.com",
  messagingSenderId: "587876461876"
}

firebase.initializeApp(credentials)

const messaging = firebase.messaging()
messaging.setBackgroundMessageHandler(function(payload) {
  const title = payload.data.title
  const options = {
    body: payload.data.body,
    icon: 'img/icons/logo-192.png',    
    data : {
      docId: payload.data.docId,
      owner: payload.data.owner,
      link: payload.data.link
    }
  }
  return self.registration.showNotification(title, options)
})

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.link)
  );
})