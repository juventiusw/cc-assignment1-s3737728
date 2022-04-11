import logo from '../logo.svg';
import React, { useEffect, useState } from "react";
import '../css/App.css';
import {getData} from "../data/repository";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadData() {
      const currentData = await getData();
      setData(currentData);
    }

    loadData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {!data ? "Loading..." : data}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
