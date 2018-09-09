const EventEmitter = require('events');

class Task {
   constructor(fCallback, oOptions, oContext) {
      this._fCallback = fCallback;
      this._oOptions = oOptions;
      this._oContext = oContext;
      // this._oDeferred = null;
      // this._eventEmitter = new EventEmitter();
   }

   execute() {
      var oPromise = new Promise((resolve, reject)=>{
         this._oDeferred = {
            resolve: resolve,
            reject: reject,
            promise: function() {
               return oPromise;
            }
         };
      });
      this._fCallback.call(this._oContext, this._oDeferred, this._oOptions);
      // oPromise.then(()=>{
      //    this._eventEmitter.emit('complete');
      // });
      

      return oPromise;
   }

   // onComplete(fCallback) {
   //    this._eventEmitter.on('complete', ()=>{
   //       if (typeof fCallback === 'function') {
   //          fCallback();
   //       }
   //    });
   // }
}

module.exports = Task;
