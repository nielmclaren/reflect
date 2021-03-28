import AWS from 'aws-sdk';
import { AwsClient } from 'aws4fetch'
import { GoogleLogin } from 'react-google-login';

import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const [awsClient, setAwsClient] = useState(undefined);
  const [body, setBody] = useState("");
  const [entry, setEntry] = useState({});

  useEffect(() => {
    console.log("useEffect");
    effect();

    async function effect() {
      const entry = await getEntry('2021-01-01');
      console.log("entry", entry);
      if (entry) {
        setBody(entry.body);
        setEntry(entry);
      }
    }

    async function getEntry(entryId) {
      console.log("getEntry", entryId);

      if (!awsClient) {
        console.log("No AWS client yet.");
        return null;
      }

      const url = "https://reflect-api.nielmclaren.com/api/v1/entries/2021-01-01";
      const options = {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        method: 'GET',
        mode: "cors",
      };
      const response = await awsClient.fetch(url, options);
      if (response && response.ok) {
        return await response.json();
      }
      return null;
    }
  }, [awsClient]);


  async function postEntry(entry) {
    console.log("postEntry", entry);

    if (!awsClient) {
      console.log("No AWS client yet.");
      return null;
    }

    const url = `https://reflect-api.nielmclaren.com/api/v1/entries/${entry.entryId}`;
    const options = {
      body: JSON.stringify(entry),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "POST",
      mode: "cors",
    };
    const response = await awsClient.fetch(url, options);
    if (response && response.ok) {
      return true;
    }
    return null;
  }

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

  function responseGoogle(googleUser) {
    if (googleUser.isSignedIn()) {
      console.log("Signed in.");

      // Add the Google access token to the Amazon Cognito credentials login map.
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
        Logins: { 'accounts.google.com': googleUser.getAuthResponse().id_token },
      });
      AWS.config.region = 'us-west-2';

      console.log("Getting credentials.");

      // Obtain AWS credentials
      AWS.config.credentials.get(async function (err) {
        // Access AWS resources here.
        console.log("AWS get credentials callback invoked.");
        console.log("error", err);

        setAwsClient(new AwsClient({
          secretAccessKey: AWS.config.credentials.secretAccessKey,
          accessKeyId: AWS.config.credentials.accessKeyId,
          sessionToken: AWS.config.credentials.sessionToken,
          service: 'execute-api',
          region: 'us-west-2',
        }));
      });
    }
    else {
      console.log("Not signed in.");
    }
  }

  return (
    <div className="App">

      <GoogleLogin
        clientId={googleClientId}
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
      />

      <form>
        <label>
          Body:
            <textarea value={body} onChange={event => setBody(event.target.value)} />
        </label>
        <input type="button" value="Submit" onClick={event => handleSubmit()} />
      </form>
    </div>
  );
}
