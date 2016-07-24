var clientId     = '674271502244-s7bdlo86hv8nmsbda8n4ga68h2rjolfo.apps.googleusercontent.com';
var clientSecret = 'T6Qpifuzw0gkwPcdUfMiCMZ4';
var scopes = ['https://www.googleapis.com/auth/tasks.readonly', 'profile'];

// Callback funtion called after the Client Library has finished loading
function handleClientLoad() {
  // 1. Set the API Key
  gapi.client.setApiKey(clientSecret);
  // 2. Call the function that checks if the user  is Authenticated. This is defined in the next section
  window.setTimeout(checkAuth,1);
}
function checkAuth() {
  // Call the Google Accounts Service to determine the current user's auth status.
  // Pass the response to the handleAuthResult callback function
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}
function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
// The user has authorized access
// Load the Analytics Client. This function is defined in the next section.
    loadAnalyticsClient();
  } else {
// User has not Authenticated and Authorized
  }
}
// Authorized user
function handleAuthorized() {
}
function loadAnalyticsClient() {
  // Load the Analytics client and set handleAuthorized as the callback function
  gapi.client.load('analytics', 'v3', handleAuthorized);
}
