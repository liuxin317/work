function learn(somthing) {
  console.log(somthing)
};

function we(callback, somthing) {
  somthing += ' is coll'
  callback(somthing)
};

we(learn, 'Node');