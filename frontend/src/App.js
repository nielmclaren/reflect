import AWS from 'aws-sdk';
import { AwsClient } from 'aws4fetch'
import { GoogleLogin } from 'react-google-login';
import { Button, TextField } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { useEffect, useState } from "react";

import { Backend } from './backend';
import { MockBackend } from './mockBackend';
import { Util } from './util';
import "./App.css";

export default function App() {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const [backend, setBackend] = useState(undefined);
  const [viewBody, setViewBody] = useState("");
  const [viewDate, setViewDate] = useState(new Date());

  useEffect(() => {
    (async function viewDateChanged() {
      console.log("viewDateChanged()");

      if (!backend) {
        console.log("Backend not ready yet.");
        return;
      }

      console.log("viewDate", viewDate, viewDate.toISOString());
      const entryId = viewDate.toISOString().slice(0, 10);
      console.log("entryId", entryId);
      const entry = await backend.getEntry(entryId);
      console.log("entry", entry);
      if (entry) {
        setViewBody(entry.body);
      }
    })();
  }, [backend, viewDate]);

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

        setBackend(new Backend(new AwsClient({
          secretAccessKey: AWS.config.credentials.secretAccessKey,
          accessKeyId: AWS.config.credentials.accessKeyId,
          sessionToken: AWS.config.credentials.sessionToken,
          service: 'execute-api',
          region: 'us-west-2',
        })));
      });
    }
    else {
      throw new Error("Got Google response but not signed in.");
    }
  }

  async function handleSubmit() {
    console.log("Handle submit.");

    if (!backend) {
      console.log("Backend not ready yet.");
      return;
    }

    const entry = {
      entryId: Util.dateToString(viewDate),
      body: viewBody,
    };

    if (await backend.postEntry(entry)) {
      console.log("Success");
    } else {
      console.log("Failure");
    }
  }

  let loginButton = "";
  if (Util.isLocalhost()) {
    if (!backend) {
      setBackend(new MockBackend());
    }
  } else {
    loginButton = <GoogleLogin
      clientId={googleClientId}
      buttonText="Login"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={'single_host_origin'}
      isSignedIn={true}
    />;
  }

  let form = "";
  if (backend) {
    form = <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          autoOk={true}
          disableFuture={true}
          fullWidth={true}
          inputVariant="outlined"
          margin="normal"
          onChange={value => setViewDate(value)}
          value={viewDate}
        />
      </MuiPickersUtilsProvider>

      <TextField id="body"
        fullWidth={true}
        label="Body"
        margin="normal"
        multiline={true}
        onChange={event => setViewBody(event.target.value)}
        required={true}
        rows="12"
        value={viewBody}
        variant="outlined"
      />

      <Button
        color="primary"
        fullWidth={true}
        margin="normal"
        onClick={event => handleSubmit()}
        variant="contained">Submit</Button>
    </div>;
  }

  return (
    <div className="App">
      {loginButton}
      {form}
    </div>
  );
}
