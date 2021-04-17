import AWS from 'aws-sdk';
import { AwsClient } from 'aws4fetch'
import { GoogleLogin } from 'react-google-login';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { useEffect, useState } from "react";

import { Backend } from './backend';
import { MockBackend } from './mockBackend';
import { Util } from './util';
import "./App.css";
import EntryEditor from './EntryEditor';

export default function App() {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";
  const [backend, setBackend] = useState<Backend | MockBackend | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewBody, setViewBody] = useState<string>("");
  const [viewMoment, setViewMoment] = useState<string>("");
  const [viewDate, setViewDate] = useState<Date>(new Date());

  useEffect(() => {
    (async function viewDateChanged() {
      console.log("viewDateChanged()");
      setViewBody("");
      setViewMoment("");
      setIsLoading(true);

      if (!backend) {
        console.log("Backend not ready yet.");
        return;
      }

      console.log("viewDate", viewDate);
      const entryId = Util.dateToString(viewDate);
      console.log("entryId", entryId);
      const entry = await backend.getEntry(entryId);
      console.log("entry", entry);
      if (entry) {
        setViewBody(entry.body);
        setViewMoment(entry.moment);
      }
      setIsLoading(false);
    })();
  }, [backend, viewDate]);

  function responseGoogle(googleUser: any) {
    if (googleUser.isSignedIn()) {
      console.log("Signed in.");

      // Add the Google access token to the Amazon Cognito credentials login map.
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID || "",
        Logins: { 'accounts.google.com': googleUser.getAuthResponse().id_token },
      });
      AWS.config.region = 'us-west-2';

      console.log("Getting credentials.");

      // Obtain AWS credentials
      AWS.config.getCredentials(async function (err: any) {
        // Access AWS resources here.
        console.log("AWS get credentials callback invoked.");
        console.log("error", err);

        setBackend(new Backend(new AwsClient({
          secretAccessKey: AWS?.config?.credentials?.secretAccessKey || "",
          accessKeyId: AWS?.config?.credentials?.accessKeyId || "",
          sessionToken: AWS?.config?.credentials?.sessionToken || "",
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
      moment: viewMoment,
    };

    setIsLoading(true);
    if (await backend.postEntry(entry)) {
      console.log("Success");
    } else {
      console.log("Failure");
    }
    setIsLoading(false);
  }

  let loginButton: JSX.Element | null = null;
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

  let form: JSX.Element | null = null;
  if (backend) {
    form = <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          autoOk={true}
          disabled={isLoading}
          disableFuture={true}
          fullWidth={true}
          inputVariant="outlined"
          margin="normal"
          onChange={value => setViewDate(value || new Date())}
          value={viewDate}
        />
      </MuiPickersUtilsProvider>

      <EntryEditor
        isLoading={isLoading}
        body={viewBody}
        moment={viewMoment}
        onBodyChange={(value: string) => setViewBody(value)}
        onMomentChange={(value: string) => setViewMoment(value)}
        onSubmit={handleSubmit}
      />

    </div>;
  }

  return (
    <div className="App">
      {loginButton}
      {form}
    </div>
  );
}
