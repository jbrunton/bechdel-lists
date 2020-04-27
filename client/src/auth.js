/* global gapi */

import axios from 'axios';

const googleParams = {
  client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
  cookie_policy: 'single_host_origin',
  scope: 'email profile',
  response_type: 'code'
};

const authStatus = new Promise(function(resolve) {
  gapi.load('auth2', async function() {
    const auth = await gapi.auth2.init(googleParams);
    if (auth.isSignedIn.get()) {
      const googleUser = auth.currentUser.get();
      const user = await verifyUser(googleUser);
      resolve({ signedIn: true, user: user });
    } else {
      resolve({ signedIn: false });
    }
  });
});

async function signOut() {
  const auth2 = gapi.auth2.getAuthInstance();
  await auth2.signOut()
  location.reload();
}

async function signIn() {
  const auth2 = gapi.auth2.getAuthInstance();
  const googleUser = await auth2.signIn();
  await verifyUser(googleUser);
  location.reload();
}

async function verifyUser(googleUser) {
  try {
    const idToken = googleUser.getAuthResponse().id_token;
    const response = await axios.post('/api/auth/signin', { idToken: idToken });
    return response.data;
  } catch (e) {
    alert('Unable to sign you in.');
    signOut();
  }
}

async function authenticate() {
  const status = await authStatus;
  if (status.signedIn) {
    return status.user;
  } else {
    throw "Unauthenticated";
  }
}

export const Auth = {
  getStatus() {
    return authStatus;
  },
  authenticate: authenticate,
  signIn: signIn,
  signOut: signOut
};
