"use strict";
const Parallel = require('./parallel');

var fTest = () => {
   return new Promise((resolve)=>{
      setTimeout(()=>{
         resolve();
      }, 1000);
   });
};

var fTest2 = (oDeferred) => {
   setTimeout(()=>{
      oDeferred.resolve();
   }, 1000);
};

var parallel = new Parallel();

parallel.setThread(3);
var oTask2 = new Parallel.Task(fTest2);
parallel.addTask(oTask2);
parallel.addTask(oTask2);
parallel.addTask(oTask2);
parallel.addTask(oTask2);
parallel.addTask(oTask2);

parallel.start().then(()=>{
   console.log("test ok");
});

parallel.addTask(new Parallel.Task(fTest2));
parallel.addTask(new Parallel.Task(fTest2));