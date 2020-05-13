/* global gapi */

import axios from 'axios';
import Cookies from 'js-cookie';

const GoogleParams = {
  client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
  cookie_policy: 'single_host_origin',
  scope: 'email profile',
  response_type: 'code'
};

function getAssumedStatus() {
  const assumedUserName = Cookies.get('user');
  const assumeSignedIn = !!assumedUserName;
  return {
    assumeSignedIn: assumeSignedIn,
    assumedUserName: assumedUserName
  }
}

const authStatus = new Promise(function(resolve) {
  gapi.load('auth2', async function() {
    const auth = await gapi.auth2.init(GoogleParams);
    if (auth.isSignedIn.get()) {
      const googleUser = auth.currentUser.get();
      const user = await verifyUser(googleUser);
      resolve({ signedIn: true, user: user });
    } else {
      const { assumeSignedIn } = getAssumedStatus();
      if (assumeSignedIn) {
        // An edge case: in case the user signs out with Google but the call to /api/auth/signout fails (which would
        // leave the user cookie intact).
        // You can test by simply setting a cookie in the console: `document.cookie = "user=John Doe";`
        Cookies.remove('user');
        location.reload();
      }
      resolve({ signedIn: false });
    }
  });
});

async function signOut() {
  const auth2 = gapi.auth2.getAuthInstance();
  await auth2.signOut()
  await axios.post('/api/auth/signout');

  // so that components which use the authorize() method will correctly reload
  location.reload();
}

async function signIn(redirectPath) {
  const auth2 = gapi.auth2.getAuthInstance();
  const googleUser = await auth2.signIn();
  await verifyUser(googleUser);

  if (redirectPath) {
    location.replace(location.origin + redirectPath);
  } else {
    // so that components which use the authorize() method will correctly reload
    location.reload();
  }
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
    throw new Error("Unauthenticated");
  }
}

async function isOwner(type, id) {
  const response = await axios.get(`/api/auth/authorize/${type}/${id}`);
  return response.data.isOwner;
}

export const Auth = {
  getStatus() {
    return authStatus;
  },
  getAssumedStatus: getAssumedStatus,
  authenticate: authenticate,
  signIn: signIn,
  signOut: signOut,
  isOwner: isOwner
};
