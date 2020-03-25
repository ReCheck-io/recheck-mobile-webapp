# recheck-mobile-webapp
This is the app we use for storage of keys and working on the phone through our service.

### To use you have to 

- have node 8.15 >=

    ``` npm install ```

- ```npm run serve``` - it will listen on localhost:8080

As for a server you can open ./chain/index.js and where the [client library](https://github.com/ReCheck-io/recheck-clientjs-library) is defined, which holds all of the needed API to connect to the server, and then open inside the library.

```let e2e = require('recheck-clientjs-library')```

[beta.recheck.io](https://beta.recheck.io/) can be used as playground server, so in the library you have to hardcode at the start of the file:

```
let baseUrl = 'https://beta.recheck.io';
let network = "ae";
```

Since you are (probably) going to locally host the webapp, _init()_ is going to create some problems, so to pass it by for now this is a workable solution. 
