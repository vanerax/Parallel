"use strict";
const Parallel = require('./parallel');


var fTest = () => {
   return new Promise((resolve)=>{
      setTimeout(()=>{
         resolve();
      }, 1000);
   });
};

var fTest2 = (oDeferred, oOptions) => {
   var curIdx = idx;
   setTimeout(()=>{
      console.log(oOptions);
      oDeferred.resolve();
   }, 1000);
};

class TestClass {
   constructor() {
      this._nIdx = 0;
      this._aTasksIdx = [];
      this._oBuffer = [];
   }

   test3(oDeferred, oOptions) {
      this._aTasksIdx.push(oOptions.index);

      setTimeout(()=>{
         console.log(oOptions);
         this._aTasksIdx.splice(this._aTasksIdx.indexOf(oOptions.index), 1);
         this._oBuffer[oOptions.index] = {};

         this.flush();
         oDeferred.resolve();
      }, 1000);
   }

   flush() {

   }

   start() {
      var parallel = new Parallel();

      parallel.setThread(2);

      for (var i=0;i<5;i++) {
         var oTask = new Parallel.Task(this.test3, { index: i }, this);
         parallel.addTask(oTask);
      }

      parallel.start().then(()=>{
         console.log("test ok");
      });
   }
}

var tc = new TestClass();
tc.start();