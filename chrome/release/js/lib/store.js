!function(){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function r(e,t,n){return t&&o(e.prototype,t),n&&o(e,n),e}function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function c(e,t){return(c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function u(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var e=function(){function e(){n(this,e),this._listeners={}}return r(e,[{key:"on",value:function(e,t){(this._listeners[e]=this._listeners[e]||[]).push(t)}},{key:"trigger",value:function(e,t){(this._listeners[e]||[]).forEach(function(e){return e(t)})}},{key:"off",value:function(e){delete this._listeners[e]}}]),e}();new(function(){function t(){var e;return n(this,t),(e=function(e,t){return!t||"object"!=typeof t&&"function"!=typeof t?u(e):t}(this,a(t).call(this))).defaultRPC=[{name:"ARIA2 RPC",url:"http://localhost:6800/jsonrpc"}],e.defaultUserAgent="netdisk;6.0.0.12;PC;PC-Windows;10.0.16299;WindowsBaiduYunGuanJia",e.defaultReferer="https://pan.baidu.com/disk/home",e.defaultAppId=250528,e.defaultConfigData={rpcList:e.defaultRPC,configSync:!1,md5Check:!1,fold:0,interval:300,downloadPath:"",userAgent:e.defaultUserAgent,referer:e.defaultReferer,appId:e.defaultAppId,headers:""},e.configData={},e.on("initConfigData",e.init.bind(u(e))),e.on("setConfigData",e.set.bind(u(e))),e.on("clearConfigData",e.clear.bind(u(e))),e}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t)}(t,e),r(t,[{key:"init",value:function(){var t=this;chrome.storage.sync.get(null,function(t){function e(e){chrome.storage.local.set({key:t[e]},function(){console.log("chrome first local set: %s, %s",e,t[e])})}for(var n in t)e(n)}),chrome.storage.local.get(null,function(e){t.configData=Object.assign({},t.defaultConfigData,e),t.trigger("updateView",t.configData)})}},{key:"getConfigData",value:function(e){var t=0<arguments.length&&void 0!==e?e:null;return t?this.configData[t]:this.configData}},{key:"set",value:function(e){this.configData=e,this.save(e),this.trigger("updateView",e)}},{key:"save",value:function(t){function e(e){chrome.storage.local.set(i({},e,t[e]),function(){console.log("chrome local set: %s, %s",e,t[e])}),!0===t.configSync&&chrome.storage.sync.set(i({},e,t[e]),function(){console.log("chrome sync set: %s, %s",e,t[e])})}for(var n in t)e(n)}},{key:"clear",value:function(){chrome.storage.sync.clear(),chrome.storage.local.clear(),this.configData=this.defaultConfigData,this.trigger("updateView",this.configData)}}]),t}())}();