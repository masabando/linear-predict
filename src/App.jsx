import * as tf from "@tensorflow/tfjs";
import Graph from "./Graph.jsx";
import LossGraph from "./LossGraph.jsx";
import "./App.scss";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import MyNav from "./MyNav.jsx";
import { useState, useRef, useEffect } from "react";
import { createSampleData, convertToTensor } from "./utils.js";


async function trainModel(model, data, callback) {
  const { inputs, labels } = data;
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ["mse"],
  });
  const batchSize = 32;
  const epochs = 50;

  return await model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,
    callbacks: {
      onBatchEnd: callback
    },
  });
}

  async function testModel(model, normalizationData) {
    const { inputMax, inputMin, labelMin, labelMax } = normalizationData;

    const [xs, preds] = tf.tidy(() => {
      const xs = tf.linspace(0, 1, 100);
      const preds = model.predict(xs.reshape([100, 1]));

      const unNormXs = xs.mul(inputMax.sub(inputMin)).add(inputMin);
      const unNormPreds = preds.mul(labelMax.sub(labelMin)).add(labelMin);

      // Un-normalize the data
      return [unNormXs.arraySync(), unNormPreds.arraySync()];
    });

    const predictedPoints = Array.from(xs).map((val, i) => {
      return { x: val, y: preds[i] };
    });

    return predictedPoints;
  }


function App() {
  const [pDataSet, setPDataSet] = useState([]);
  const [lossData, setLossData] = useState([]);
  // シーケンシャルモデルを作成
  const model = useRef(null);
  const tensorData = useRef(null);
  const trainButton = useRef(null);
  const predictButton = useRef(null);
  const varsRef = {
    a: useRef(null),
    b: useRef(null),
    random: useRef(null),
  };
  const [vars, setVars] = useState({ a: 2, b: 3, random: 0 });
  const [dataSet, setDataSet] = useState(createSampleData(100, vars.a, vars.b, vars.random));

  useEffect(() => {
    setVars({ a: vars.a, b: vars.b, random: vars.random });
    model.current = null;
    setLossData([]);
    setDataSet(createSampleData(100, vars.a, vars.b, vars.random));
  }, [vars.a, vars.b, vars.random]);


  useEffect(() => {
    if (model.current === null) {
      console.log("create model");
      trainButton.current.disabled = true;
      predictButton.current.disabled = true;
      model.current = tf.sequential();
      // 入力層を追加
      model.current.add(
        tf.layers.dense({ units: 1, inputShape: [1], useBias: true })
      );
      // 出力層を追加
      model.current.add(tf.layers.dense({ units: 1, useBias: true }));
      // データをテンソルに変換
      tensorData.current = convertToTensor(dataSet);
      // ボタンを押せるようにする
      trainButton.current.disabled = false;
      predictButton.current.disabled = false;
    }
    // eslint-disable-next-line
  }, [dataSet]);

  function disabledAll(bool = true) {
    trainButton.current.disabled = bool;
    predictButton.current.disabled = bool;
    varsRef.a.current.disabled = bool;
    varsRef.b.current.disabled = bool;
    varsRef.random.current.disabled = bool;
  }


  return (
    <>
      <MyNav />
      <Container fluid className="mt-3">
        <Graph dataSet={dataSet} predictedDataSet={pDataSet} />
        <div className="mt-3">
          Y = {vars.a}X + {vars.b} ± {vars.random}
        </div>
        <InputGroup className="my-2">
          <InputGroup.Text>Y = </InputGroup.Text>
          <Form.Control
            ref={varsRef.a}
            type="number"
            placeholder="a"
            defaultValue={vars.a}
            onChange={(e) => setVars({ ...vars, a: +e.target.value })}
          />
          <InputGroup.Text>X</InputGroup.Text>
          <Form.Control
            ref={varsRef.b}
            type="number"
            placeholder="b"
            defaultValue={vars.b}
            onChange={(e) => setVars({ ...vars, b: +e.target.value })}
          />
          <InputGroup.Text>±</InputGroup.Text>
          <Form.Control
            ref={varsRef.random}
            type="number"
            placeholder="random"
            defaultValue={vars.random}
            onChange={(e) => setVars({ ...vars, random: +e.target.value })}
          />
          </InputGroup>
        <Button
          ref={trainButton}
          onClick={() => {
            disabledAll();
            trainModel(model.current, tensorData.current, (batch, logs) => {
              setLossData((prev) => [
                ...prev,
                { x: prev.length, y: logs.loss },
              ]);
            }).then(() => {
              disabledAll(false);
            });
          }}
        >
          学習開始
        </Button>
        <Button
          ref={predictButton}
          className="ms-3"
          onClick={() => {
            testModel(model.current, tensorData.current).then((result) => {
              setPDataSet(result);
            });
          }}
        >
          予測開始
        </Button>
        <div className="mt-3">
          Current Loss :{" "}
          {lossData.length > 0 ? lossData[lossData.length - 1].y : "N/A"}
        </div>
        <LossGraph lossData={lossData} />
      </Container>
    </>
  );
}

export default App;
