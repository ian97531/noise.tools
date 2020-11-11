import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";

import {
  createInitMessage,
  createListener,
  CreateListener,
  WorkerMessage,
  createResetMessage,
  createPlayMessage,
  createUpdateV1Message,
  createUpdateV2Message,
  createUpdateAMessage,
  createPauseMessage,
} from "utils/noiseWorkerApi";

import CanvasWorker from "workers/noiseWorker.worker.ts";

import styles from "./App.module.scss";

export interface ComponentProps extends React.AllHTMLAttributes<HTMLElement> {
  width: number;
  height: number;
}

export default function Home(props: ComponentProps) {
  const { className, width, height, ...elementProps } = props;
  const [v1, setV1] = useState<number>(12.9898);
  const [v2, setV2] = useState<number>(78.233);
  const [a, setA] = useState<number>(43758.5453123);
  const [play, setPlay] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<CanvasWorker>();

  const updateV1 = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setV1(evt.target.valueAsNumber);
      if (workerRef.current) {
        workerRef.current.postMessage(
          createUpdateV1Message(evt.target.valueAsNumber)
        );
      }
    },
    []
  );

  const updateV2 = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setV2(evt.target.valueAsNumber);
      if (workerRef.current) {
        workerRef.current.postMessage(
          createUpdateV2Message(evt.target.valueAsNumber)
        );
      }
    },
    []
  );

  const updateA = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setA(evt.target.valueAsNumber);
      if (workerRef.current) {
        workerRef.current.postMessage(
          createUpdateAMessage(evt.target.valueAsNumber)
        );
      }
    },
    []
  );

  const togglePlay = useCallback(
    (evt: React.MouseEvent<HTMLButtonElement>) => {
      setPlay(!play);
      if (workerRef.current) {
        workerRef.current.postMessage(
          play ? createPauseMessage() : createPlayMessage()
        );
      }
    },
    [play]
  );

  const reset = useCallback((evt: React.MouseEvent<HTMLButtonElement>) => {
    if (workerRef.current) {
      workerRef.current.postMessage(createResetMessage());
    }
  }, []);

  useLayoutEffect(() => {
    const offline = canvasRef.current.transferControlToOffscreen();
    const worker = new CanvasWorker();
    const listener = createListener();

    listener.listen(WorkerMessage.Ready, () => {
      worker.postMessage(
        createInitMessage(offline, width, height, v1, v2, a),
        [offline]
      );
      worker.postMessage(createResetMessage());
      worker.postMessage(createPlayMessage());
    });

    worker.addEventListener("message", listener.onMessage);
    workerRef.current = worker;

    return () => {
      worker.terminate();
      worker.removeEventListener("message", listener.onMessage);
      workerRef.current = undefined;
      listener.stopListening();
    };
  }, []);

  return (
    <div className={styles.Home}>
      <h1 className={styles.title}>Noise Tools</h1>
      <canvas
        width={`${width}px`}
        height={`${height}px`}
        className={clsx(styles.canvas, className)}
        ref={canvasRef}
        {...elementProps}
      />
      <div>
        <div className={styles.controlRow}>
          <label className={styles.label}>V1: {v1}</label>
          <input
            className={styles.inputRange}
            type="range"
            min="0"
            max="1000"
            step="0.1"
            onChange={updateV1}
            value={v1}
          />
        </div>
        <div className={styles.controlRow}>
          <label className={styles.label}>V2: {v2}</label>
          <input
            className={styles.inputRange}
            type="range"
            min="0"
            max="1000"
            step="0.1"
            onChange={updateV2}
            value={v2}
          />
        </div>
        <div className={styles.controlRow}>
          <label className={styles.label}>A: {a}</label>
          <input
            className={styles.inputRange}
            type="range"
            min="0"
            max="1000000"
            step="10"
            onChange={updateA}
            value={a}
          />
        </div>
        <div className={styles.buttonRow}>
          <button className={styles.button} onClick={reset}>
            Clear
          </button>
          <button className={styles.button} onClick={togglePlay}>
            {play ? "Pause" : "Play"}
          </button>
        </div>
      </div>
    </div>
  );
}
