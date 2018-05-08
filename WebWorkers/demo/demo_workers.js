var i=0;

function timedCount()
{
onmessage =function (evt){
  console.log(evt.data + "1"); 
  postMessage(evt.data);
}
i=i+1;
postMessage(i); // 向页面传回消息
setTimeout("timedCount()",500);
}

timedCount();