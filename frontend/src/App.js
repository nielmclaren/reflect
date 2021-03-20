import { useState } from 'react';
import './App.css';

export default function App() {
  const [body, setBody] = useState("");

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
