function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function dSigmoid(x) {
  let y = sigmoid(x);
  return y * (1 - y);
}

//----------------------------------------------
function identity(x) {
  return x;
}

function dIdentity(x) {
  return x;
}

//----------------------------------------------
function binaryStep(x) {
  if (x >= 0) {
    return 1;
  } else {
    return 0;
  }
}

function dBinaryStep(x) {
  return 0;
}

//----------------------------------------------
function tanH(x) {
  return Math.tanh(x);
}

function dTanH(x) {
  return 1 - (Math.pow(Math.tanh(x), 2));
}

//----------------------------------------------
function softsign(x) {
  return x / (1 + Math.abs(x));
}

function dSoftsign(x) {
  return x / (Math.pow(1 + Math.abs(x), 2));
}

//----------------------------------------------
function ReLu(x) {
  if (x >= 0) {
    return x;
  }else {
    return 0;
  }
}

function dReLu(x) {
  if (x >= 0) {
    return 1;
  }else {
    return 0;
  }
}

//----------------------------------------------
