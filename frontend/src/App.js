import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [body, setBody] = useState("");
  const [entry, setEntry] = useState({});

  useEffect(() => {
    console.log("use effect");
    async function effect() {
      const entry = await getEntry('2021-01-01');
      console.log("entry", entry);
      setBody(entry.body);
      setEntry(entry);
    }
    effect();
  }, []);

  async function handleSubmit() {
    console.log("Handle submit.");
    const prevEntry = Object.assign({}, entry); // Shallow copy only.
    const nextEntry = {
      entryId: '2021-01-01',
      body: body,
    };

    // Optimistic
    setEntry(nextEntry);

    if (await postEntry(nextEntry)) {
      console.log("Success");
    } else {
      console.log("Failure");
      setEntry(prevEntry);
    }
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label>
          Body:
          <textarea value={body} onChange={event => setBody(event.target.value)} />
        </label>
        <input type="button" value="Submit" onClick={event => handleSubmit()} />
      </form>
    </div>
  );
}

async function getEntry(entryId) {
  console.log("getEntry", entryId);
  const url = "https://reflect-api.nielmclaren.com/api/v1/entries/2021-01-01";
  const options = {
    method: "GET",
    mode: "cors",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json;charset=UTF-8"
    },
  };
  const response = await fetch(url, options);
  if (response && response.ok) {
    return await response.json();
  }
  return null;
}

async function postEntry(entry) {
  console.log("postEntry", entry);
  const url = `https://reflect-api.nielmclaren.com/api/v1/entries/${entry.entryId}`;
  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json;charset=UTF-8"
    },
    body: JSON.stringify(entry)
  };
  const response = await fetch(url, options);
  if (response && response.ok) {
    return true;
  }
  return null;
}
