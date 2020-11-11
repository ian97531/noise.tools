import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";

import {
  createInitMessage,
  createListener,
  CreateListener,
  WorkerMessage,
  createResetMessage,
  createPlayMessage,
  createUpdateNoiseMessage,
  createUpdateDarkenMessage,
  createUpdateLightenMessage,
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
  const [noise, setNoise] = useState<number>(2);
  const [lighten, setLighten] = useState<number>(0.05);
  const [darken, setDarken] = useState<number>(0.2);
  const [play, setPlay] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<CanvasWorker>();

  const updateNoise = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setNoise(evt.target.valueAsNumber);
      if (workerRef.current) {
        workerRef.current.postMessage(
          createUpdateNoiseMessage(evt.target.valueAsNumber)
        );
      }
    },
    []
  );

  const updateDarken = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setDarken(evt.target.valueAsNumber);
      if (workerRef.current) {
        workerRef.current.postMessage(
          createUpdateDarkenMessage(evt.target.valueAsNumber)
        );
      }
    },
    []
  );

  const updateLighten = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setLighten(evt.target.valueAsNumber);
      if (workerRef.current) {
        workerRef.current.postMessage(
          createUpdateLightenMessage(evt.target.valueAsNumber)
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
        createInitMessage(offline, width, height, noise, lighten, darken),
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
          <label className={styles.label}>Randomness: {noise}</label>
          <input
            className={styles.inputRange}
            type="range"
            min="0"
            max="10"
            step="0.1"
            onChange={updateNoise}
            value={noise}
          />
        </div>
        <div className={styles.controlRow}>
          <label className={styles.label}>Absorption: {darken}</label>
          <input
            className={styles.inputRange}
            type="range"
            min="0"
            max="1"
            step="0.01"
            onChange={updateDarken}
            value={darken}
          />
        </div>
        <div className={styles.controlRow}>
          <label className={styles.label}>Evaporation: {lighten}</label>
          <input
            className={styles.inputRange}
            type="range"
            min="0"
            max="1"
            step="0.01"
            onChange={updateLighten}
            value={lighten}
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
