"use strict";
const Parallel = require('./parallel');

var fTest = () => {
   return new Promise((resolve)=>{
      setTimeout(()=>{
         resolve();
      }, 1000);
   });
};

var parallel = new Parallel();
parallel.setThread(3);

parallel.addTask(fTest);
parallel.addTask(fTest);
parallel.addTask(fTest);
parallel.addTask(fTest);
parallel.addTask(fTest);

parallel.start().then(()=>{
   console.log("test ok");
});