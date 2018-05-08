window.onload = function () {
  var data = [1000,1000,1000,1000,1000,1000]; // 后台返回数据;
  createCanvas(data);
  window.status = "put your message here";
};

function createCanvas (data) { // 创建画布;
  var c = document.getElementById('canvas_box');
  var context = c.getContext("2d");
  var bkColors = ['#0070c0','#00e100','#ffa500','#00e1e1','#ff0000','#ffff00'];
  var three = document.getElementById('three');
  var two = document.getElementById('two');
  var one = document.getElementById('one');
  var isInitData = 0;
  var opacity = 0;
  var initOpacity = 0.6;
  var dataEach = ''; // 运行了的数据;

  for (var i = 0; i < data.length; i++) {
    if (data[i] >= 3) {
      isInitData++;
    };
  };

  modelBlock(data, bkColors);

  for (var i = 0; i < data.length; i++) {
    dataEach += (i+1) + ',';
    testData(dataEach, (i+1));
  };

  function testData (dataEach, i) { // 检测数据;
    setTimeout (function () {
      run(data, bkColors, (1), dataEach);
    }, i*1000);
  };

  function modelBlock (data, bkColors, num, dataEach) { // 菱形块;
    for (var i = 0; i < bkColors.length; i++) {
      //设置对象起始点和终点
      context.save(); //保存当前环境的状态
      context.beginPath(); //起始一条路径，或重置当前路径
      //设置样式
      context.lineWidth = 0;
      context.strokeStyle = bkColors[i];
      context.fillStyle = bkColors[i];
      context.globalCompositeOperation="destination-over"; //在目标图像上显示源图像。
      
      context.translate(177,160);//将绘图原点移到画布中点
      context.rotate(i*(Math.PI/180)*60);//旋转角度
      context.translate(-177,-160);//将画布原点移动
      context.moveTo(90,10);
      context.lineTo(90,110);
      context.lineTo(177,160);
      context.lineTo(177,60);
      context.lineTo(90,10);
      context.fill();//填充;
      
      // context.stroke();//绘制
      if (isInitData != 6) { // 不显示紫色圆;
        if (!num) {
          context.beginPath(); //起始一条路径，或重置当前路径
          context.globalCompositeOperation="source-over";
          context.globalAlpha = '0.6';
          context.fillStyle = 'white';
          context.moveTo(90,10);
          context.lineTo(90,110);
          context.quadraticCurveTo(116,65,177,60);
          context.lineTo(90,10);
          context.fill();//填充;
          
          threeImg(three, 0.6);
          twoImg(two, 0.6);
          oneImg(one, 0.6);
        } else {
          if (dataEach.indexOf(i + 1) > -1) { // 数据循环;
            if (data[i] > 3) {
              context.beginPath(); //起始一条路径，或重置当前路径
              context.globalCompositeOperation="source-over";
              context.globalAlpha = '0.6';

              // 计算圆外的渐变百分比;
              var gradient = context.createLinearGradient(128,80,90,15);
              var dataLength = String(data[i]).length;
              var dl = String((data[i] - 3));
              var subLen = String((data[i] - 3)).length - 1;

              var percentage = dl.substr(subLen, 1) == '0' ? (data[i] - 2) : (data[i] - 3);

              if (dataLength > 1) {
                var multiple = Math.ceil(percentage / 10);
              } else {
                var multiple = 1;
              };

              for (var k = 0; k < multiple*10; k++ ){
                if (k < percentage) {
                  gradient.addColorStop((1/(multiple*10))*k, bkColors[i]);
                } else {
                  gradient.addColorStop((1/(multiple*10))*k, 'white');
                };
              };

              gradient.addColorStop(1, 'white');
              context.fillStyle = gradient;
              context.moveTo(90,10);
              context.lineTo(90,110);
              context.quadraticCurveTo(116,65,177,60);
              context.lineTo(90,10);
              context.fill();//填充;

              threeImg(three, 0);
              twoImg(two, 0);
              oneImg(one, 0);
            } else { // 没有超出3;
              context.beginPath(); //起始一条路径，或重置当前路径
              context.globalCompositeOperation="source-over";
              context.globalAlpha = '0.6';
              // var gradient = context.createLinearGradient(128,80,90,15);
              // gradient.addColorStop(0, bkColors[i]);
              // gradient.addColorStop(1, 'white');
              context.fillStyle = 'white';
              context.moveTo(90,10);
              context.lineTo(90,110);
              context.quadraticCurveTo(116,65,177,60);
              context.lineTo(90,10);
              context.fill();//填充;
            };

            if (data[i] > 0 && data[i] <= 1) {
              oneImg(one, 0);
              threeImg(three, 0.6);
              twoImg(two, 0.6);
            } else if (data[i] > 1 && data[i] <= 2) {
              oneImg(one, 0);
              threeImg(three, 0.6);
              twoImg(two, 0);
            } else if (data[i] > 2 && data[i] <= 3) {
              oneImg(one, 0);
              threeImg(three, 0);
              twoImg(two, 0);
            } else if (data[i] === 0) {
              threeImg(three, 0.6);
              twoImg(two, 0.6);
              oneImg(one, 0.6);
            };
          } else {
            context.beginPath(); //起始一条路径，或重置当前路径
            context.globalCompositeOperation="source-over";
            context.globalAlpha = '0.6';
            context.fillStyle = 'white';
            context.moveTo(90,10);
            context.lineTo(90,110);
            context.quadraticCurveTo(116,65,177,60);
            context.lineTo(90,10);
            context.fill();//填充;

            threeImg(three, 0.6);
            twoImg(two, 0.6);
            oneImg(one, 0.6);
          }
        };
      } else { // 都大于3;
        if (!num) {
          context.beginPath(); //起始一条路径，或重置当前路径
          context.globalCompositeOperation="source-over";
          context.globalAlpha = '0.6';
          context.fillStyle = 'white';
          context.moveTo(90,10);
          context.lineTo(90,110);
          context.quadraticCurveTo(116,65,177,60);
          context.lineTo(90,10);
          context.fill();//填充;
        } else { // 直接展示紫色圆;
          if (dataEach.indexOf(i + 1) > -1) { // 数据循环;
            if (data[i] > 3) {
              context.beginPath(); //起始一条路径，或重置当前路径
              context.globalCompositeOperation="source-over";
              context.globalAlpha = '0.6';

              // 计算圆外的渐变百分比;
              var gradient = context.createLinearGradient(128,80,90,15);
              var dataLength = String(data[i]).length;
              var dl = String((data[i] - 3));
              var subLen = String((data[i] - 3)).length - 1;

              var percentage = dl.substr(subLen, 1) == '0' ? (data[i] - 2) : (data[i] - 3);

              if (dataLength > 1) {
                var multiple = Math.ceil(percentage / 10);
              } else {
                var multiple = 1;
              };

              for (var k = 0; k < multiple*10; k++ ){
                if (k < percentage) {
                  gradient.addColorStop((1/(multiple*10))*k, bkColors[i]);
                } else {
                  gradient.addColorStop((1/(multiple*10))*k, 'white');
                };
              };

              gradient.addColorStop(1, 'white');
              context.fillStyle = gradient;
              context.moveTo(90,10);
              context.lineTo(90,110);
              context.quadraticCurveTo(116,65,177,60);
              context.lineTo(90,10);
              context.fill();//填充;
            } else if(data[i] === 3) {
              context.beginPath(); //起始一条路径，或重置当前路径
              context.globalCompositeOperation="source-over";
              context.globalAlpha = '0.6';
              context.fillStyle = 'white';
              context.moveTo(90,10);
              context.lineTo(90,110);
              context.quadraticCurveTo(116,65,177,60);
              context.lineTo(90,10);
              context.fill();//填充;
            };
          } else {
            context.beginPath(); //起始一条路径，或重置当前路径
            context.globalCompositeOperation="source-over";
            context.globalAlpha = '0.6';
            context.fillStyle = 'white';
            context.moveTo(90,10);
            context.lineTo(90,110);
            context.quadraticCurveTo(116,65,177,60);
            context.lineTo(90,10);
            context.fill();//填充;
          }
        };
      };
      
      context.closePath(); // 关闭当前路径;
      context.restore(); //返回之前保存过的路径状态和属性
    };

    if (isInitData === 6) {
      arc(1);
    };
  };

  function oneImg(one, number) {
      context.save(); //保存当前环境的状态;
      context.beginPath(); //起始一条路径，或重置当前路径
      context.globalCompositeOperation="source-over";
      context.globalAlpha = number; // 设置或返回绘图的当前 alpha 或透明值;
      context.drawImage(one, 144, 124, 33, 35);
      context.closePath(); // 关闭当前路径;
      context.restore(); //返回之前保存过的路径状态和属性;
  };

  function twoImg(two, number) {
    context.beginPath(); //起始一条路径，或重置当前路径
    context.globalCompositeOperation="source-over";
    context.globalAlpha = number; // 设置或返回绘图的当前 alpha 或透明值;
    context.drawImage(two, 117, 92, 60, 51);
  };

  function threeImg(three, number) {
    context.beginPath(); //起始一条路径，或重置当前路径
    context.globalCompositeOperation="source-over";
    context.globalAlpha = number; // 设置或返回绘图的当前 alpha 或透明值;
    context.drawImage(three, 88, 59, 89, 68);
  };

  function arc (opacity) { // 绘制圆;
    // if (type) {
    //   var timer = setInterval(function () {
    //     if (opacity >= 1) {
    //       clearInterval(timer);
    //     } else {
    //       opacity = opacity + 0.1;
    //       run (data, bkColors);
    //     };
    //   }, 50);
    // } else {
    //   opacity = 0;
    // };
    context.save(); //保存当前环境的状态;
    context.beginPath(); //起始一条路径，或重置当前路径;
    context.fillStyle = "#4c49b4";
    context.globalAlpha = opacity; // 设置或返回绘图的当前 alpha 或透明值;
    context.arc(177,160,100,0*Math.PI,2*Math.PI,false);
    context.fill();//填充背景色;
    context.closePath(); // 关闭当前路径;
    context.restore(); //返回之前保存过的路径状态和属性;
  };

  function run (data, bkColors, num, dataEach) { // 运动;
    context.clearRect(0,0,360,330);
    modelBlock(data, bkColors, num, dataEach);
  };
};

