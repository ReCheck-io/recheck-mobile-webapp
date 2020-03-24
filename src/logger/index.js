const config = require('./config');

module.exports = {

  log: function (_arguments) {
    if (config.log.level === 'debug') {
      var args = Array.prototype.slice.call(arguments);
      args.unshift('[DEBUG][' + (new Date()).toUTCString() + ']' + " ");
      // eslint-disable-next-line no-console
      console.log.apply(console, args, _arguments);
    }
  },

  error: function (_arguments) {
    if (config.log.level !== 'disabled') {
      var args = Array.prototype.slice.call(arguments);
      args.unshift('[ERROR][' + (new Date()).toUTCString() + ']' + " ");
      // eslint-disable-next-line no-console
      console.log.apply(console, args, _arguments);      
    }
  }

}
