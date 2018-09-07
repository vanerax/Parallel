"use strict";

const Status = {
   INITIAL: 0,
   RUNNING: 1,
   PAUSED: 2,
   STOPPED: 3
};

class Parallel {
   constructor() {
      this._eStatus = Status.INITIAL;
      this._nThread = 2;
      this._aRunningTaskIds = [];
      this._aPendingTaskIds = [];
      this._oRunningTasks = {};
      this._oPendingTasks = {};
      this._nNextTaskId = 0;
      this._oCompleteDeferred = null;
   }

   start() {
      this._eStatus = Status.RUNNING;
      this._processMultipleTasks();

      return new Promise((resolve, reject) => {
         this._oCompleteDeferred = {resolve: resolve, reject: reject};
      });
   }

   setThread(nThread) {
      this._nThread = nThread;
   }

   addTask(fTask) {
      var nId = this._generateTaskId();
      this._oPendingTasks[nId] = fTask;
      this._aPendingTaskIds.push(nId);
      if (this._isRunning()) {
         this._process();
      }
   }

   _hasAvailableThread() {
      return this._aRunningTaskIds.length < this._nThread;
   }

   _getAvailableThreadCount() {
      return this._nThread - this._aRunningTaskIds.length;
   }

   _hasPendingTasks() {
      return this._aPendingTaskIds.length > 0;
   }

   _isRunning() {
      return this._eStatus === Status.RUNNING;
   }

   _isCompleted() {
      return this._aPendingTaskIds.length === 0 && this._aRunningTaskIds.length === 0;
   }

   _processMultipleTasks() {
      var nCount = Math.min(this._aPendingTaskIds.length, this._getAvailableThreadCount());
      // console.log(this._aPendingTaskIds.length, this._getAvailableThreadCount());
      for (var i=0;i<nCount;i++) {
         this._process();
      }
   }

   _process() {
      if (this._isRunning() && this._hasPendingTasks() && this._hasAvailableThread()) {
         var nId = this._aPendingTaskIds.shift();
         var fTask = this._oPendingTasks[nId];
         delete this._oPendingTasks[nId];
         this._oRunningTasks[nId] = fTask;
         this._aRunningTaskIds.push(nId);
         console.log("processing " + nId);

         if (typeof fTask === 'function') {
            var oRet = fTask();
            if (oRet instanceof Promise) {
               oRet.then(()=>{
                  var nPos = this._aRunningTaskIds.indexOf(nId);
                  this._aRunningTaskIds.splice(nPos, 1);
                  delete this._oRunningTasks[nId];

                  if (this._isCompleted()) {
                     this._oCompleteDeferred.resolve();
                  } else {
                     this._processMultipleTasks();
                  }
               });
            }
         }
      }
   }

   _generateTaskId() {
      return this._nNextTaskId++;
   }
}

module.exports = Parallel;
