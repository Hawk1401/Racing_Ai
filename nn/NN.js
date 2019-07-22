function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function dsigmoid(y) {
  // return sigmoid(x) * (1 - sigmoid(x));
  return y * (1 - y);
}

class NeuralNetwork {
  constructor(input, hidden0, hidden1, output, learningRate) {
    this.input = input;
    this.hidden0 = hidden0;
    this.hidden1 = hidden1;
    this.output = output;
    this.learningRate = learningRate;

    this.weight_I_H0 = new Matrix(this.hidden0, this.input);
    this.weight_H0_H1 = new Matrix(this.hidden1, this.hidden0);
    this.weight_H1_O = new Matrix(this.output, this.hidden1);

    this.weight_I_H0.randomize();
    this.weight_H0_H1.randomize();
    this.weight_H1_O.randomize();

    this.bias_I_H0 = new Matrix(this.hidden0, 1);
    this.bias_H0_H1 = new Matrix(this.hidden1, 1);
    this.bias_H1_O = new Matrix(this.output, 1);

    this.bias_H1_O.randomize();
    this.bias_H0_H1.randomize();
    this.bias_I_H0.randomize();
  }
  setNewconnections(weight, bias) {
    this.weight_I_H0.copy(weight[0]);
    this.weight_H0_H1.copy(weight[1]);
    this.weight_H1_O.copy(weight[2]);

    this.bias_I_H0.copy(bias[0]);
    this.bias_H0_H1.copy(bias[1]);
    this.bias_H1_O.copy(bias[2]);
  }
  copy() {
    let weight = [this.weight_I_H0, this.weight_H0_H1, this.weight_H1_O];

    let bias = [this.bias_I_H0, this.bias_H0_H1, this.bias_H1_O];

    let brain1 = new NeuralNetwork(
      this.input,
      this.hidden0,
      this.hidden1,
      this.output,
      this.learningRate
    );
    brain1.setNewconnections(weight, bias);
    return brain1;
  }
  mutate() {
    this.weight_I_H0.mutate(this.learningRate);
    this.weight_H0_H1.mutate(this.learningRate);
    this.weight_H1_O.mutate(this.learningRate);

    this.bias_H1_O.mutate(this.learningRate);
    this.bias_H0_H1.mutate(this.learningRate);
    this.bias_I_H0.mutate(this.learningRate);
  }

  feedForward(inputArray) {
    let inputsData = Matrix.fromArray(inputArray);

    let hidden0Data = Matrix.multiply(this.weight_I_H0, inputsData);
    hidden0Data.add(this.bias_I_H0);
    hidden0Data.map(tanH);

    let hidden1Data = Matrix.multiply(this.weight_H0_H1, hidden0Data);
    hidden1Data.add(this.bias_H0_H1);
    hidden1Data.map(tanH);

    let outputData = Matrix.multiply(this.weight_H1_O, hidden1Data);
    outputData.add(this.bias_H1_O);
    outputData.map(tanH);

    let outPutArray = outputData.toArray();
    let record = 0;
    let index = 0;

    for (let i = 0; i < outPutArray.length; i++) {
      let versuch = outPutArray[i];
      if (versuch > record) {
        record = versuch;
        index = i;
      }
    }

    return index;
  }

  training(inputArray, expectedArray) {
    let inputsData = Matrix.fromArray(inputArray);
    let expectedData = Matrix.fromArray(expectedArray);
    //calc the first hiddenlayer
    let hidden0Data = Matrix.multiply(this.weight_I_H0, inputsData);
    hidden0Data.add(this.bias_I_H0);
    let oldHidden0Data = hidden0Data;
    hidden0Data.map(tanH);

    //calc the second hiddenlayer
    let hidden1Data = Matrix.multiply(this.weight_H0_H1, hidden0Data);
    hidden1Data.add(this.bias_H0_H1);
    let oldHidden1Data = hidden1Data;
    hidden1Data.map(tanH);

    //calc the outputs
    let outputData = Matrix.multiply(this.weight_H1_O, hidden1Data);
    outputData.add(this.bias_H1_O);
    let oldOutputData = outputData;
    outputData.map(tanH);
    //error = expected - outputData
    //gradients = learningRate * errorOutPut* f'(outputData)
    let errorOutPut = Matrix.subtract(expectedData, outputData);
    let gradients = Matrix.map(oldOutputData, dTanH);
    gradients.multiply(errorOutPut);
    gradients.multiply(this.learningRate);

    //delta = gradients * (layerBefor transposed)
    let hidden1DataT = Matrix.transpose(hidden1Data);
    let delta = Matrix.multiply(gradients, hidden1DataT);

    // add the delta and gradients
    this.bias_H1_O.add(gradients);
    this.weight_H1_O.add(delta);

    let hidden1T = Matrix.transpose(this.weight_H1_O);
    let errorHidden1 = Matrix.multiply(hidden1T, errorOutPut);

    let gradientsHidden1 = Matrix.map(oldHidden1Data, dTanH);
    gradientsHidden1.multiply(errorHidden1);
    gradientsHidden1.multiply(this.learningRate);

    let hidden0DataT = Matrix.transpose(hidden0Data);
    let deltaHidden1 = Matrix.multiply(gradientsHidden1, hidden0DataT);

    this.bias_H0_H1.add(gradientsHidden1);
    this.weight_H0_H1.add(deltaHidden1);

    let hiddenT = Matrix.transpose(this.weight_H0_H1);
    let errorHidden0 = Matrix.multiply(hiddenT, errorHidden1);

    let gradientsHidden0 = Matrix.map(oldHidden0Data, dTanH);
    gradientsHidden0.multiply(errorHidden0);
    gradientsHidden0.multiply(this.learningRate);

    let inputDataT = Matrix.transpose(inputsData);
    let deltaHidden0 = Matrix.multiply(gradientsHidden0, inputDataT);

    this.bias_I_H0.add(gradientsHidden0);
    this.weight_I_H0.add(deltaHidden0);
  }

  reSet() {
    //resteing the weights
    this.weight_I_H0.randomize();
    this.weight_H0_H1.randomize();
    this.weight_H1_O.randomize();

    //resteing the bais
    this.bias_H1_O.randomize();
    this.bias_H0_H1.randomize();
    this.bias_I_H0.randomize();
    console.log("rested");
  }

  setLearningRate(learningRate) {
    this.learningRate = learningRate;
    console.log("learningRate = " + this.learningRate);
  }

  getLearningRate() {
    console.log("learningRate = " + this.learningRate);
    return this.learningRate;
  }
}
