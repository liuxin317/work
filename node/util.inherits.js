// util.inherits => 继承的是Base在原型中定义的函数，实现面向对象基于原型
var util = require('util');

function Base () {
  this.name = 'LiuXin';
  this.base = 1991; 
  this.sayHello = function() { 
  console.log('Hello ' + this.name); 
  };
}

Base.prototype.showName = function () {
  console.log(this.name);
  this.name = 'HuYang';
}

function Sub() { 
  this.name = 'sub'; 
}

util.inherits(Sub, Base); // 继承的是Base在原型中定义的函数，内部的并没有被继承
var objBase = new Base();
objBase.showName();
console.log(objBase.name);
objBase.sayHello();
console.log(objBase);
var objSub = new Sub();
objSub.showName();
console.log(objSub.base);