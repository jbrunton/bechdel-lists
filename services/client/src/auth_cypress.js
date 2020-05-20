import axios from 'axios';
import Cookies from 'js-cookie';

const authStatus = new Promise(function(resolve) {
  if (Cookies.get('user')) {
    axios.get('/api/users/profile')
      .then(response => {
        resolve({ signedIn: true, user: response.data });
      })
      .catch(() => {
        resolve({ signedIn: false })
      });
  } else {
    resolve({ signedIn: false });
  }
});

async function signOut() {
  await axios.post('/api/auth/signout');
  location.reload();
} 

export const CypressAuth = {
  authStatus: authStatus,
  signOut: signOut
};
