class Task {
   constructor(fCallback, oContext) {
      this._fCallback = fCallback;
      this._oContext = oContext;
      // this._oDeferred = null;
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
      this._fCallback.call(this._oContext, this._oDeferred);
      return oPromise;
   }
}

module.exports = Task;
