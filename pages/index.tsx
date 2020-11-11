import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";

const App = dynamic(() => import("../components/app/App"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Noise Tools</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400&family=Kranky&display=swap"
          rel="stylesheet"
        />
      </Head>

      <App width={600} height={450} />
    </div>
  );
}
