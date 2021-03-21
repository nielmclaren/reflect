import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [body, setBody] = useState("");

  useEffect(() => {
    console.log("use effect");
    async function effect() {
      console.log("getting entry");
      const entry = await getEntry('2021-01-01');
      console.log(entry);
      setBody(entry.body);
    }
    effect();
  }, []);

  function handleSubmit() {
    console.log("Handle submit.");
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label>
          Body:
          <textarea value={body} onChange={event => setBody(event.target.value)} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

async function getEntry(entryId) {
  const url = "https://reflect-api.nielmclaren.com/api/v1/entries/2021-01-01";
  const options = {
    method: "GET",
    mode: "cors",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json;charset=UTF-8"
    },
    //body: JSON.stringify({})
  };
  const response = await fetch(url, options);
  if (response && response.ok) {
    return await response.json();
  }
  return null;
}