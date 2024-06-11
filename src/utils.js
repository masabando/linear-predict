import * as tf from "@tensorflow/tfjs";

export function createSampleData(num = 100, a = 2, b = 3, random = 0) {
  return new Array(num).fill(0).map((_, i) => {
    return {
      x: i,
      y: a * i + b + Math.random() * random * 2 - random,
    };
  });
}

export function convertToTensor(data) {
  return tf.tidy(() => {
    tf.util.shuffle(data);

    const inputs = data.map((d) => d.x);
    const labels = data.map((d) => d.y);

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    const inputMax = inputTensor.max();
    const inputMin = inputTensor.min();
    const labelMax = labelTensor.max();
    const labelMin = labelTensor.min();

    const normalizedInputs = inputTensor
      .sub(inputMin)
      .div(inputMax.sub(inputMin));
    const normalizedLabels = labelTensor
      .sub(labelMin)
      .div(labelMax.sub(labelMin));
    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      inputMax,
      inputMin,
      labelMax,
      labelMin,
    };
  });
}
