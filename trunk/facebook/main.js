(function() {
  // Create an ApiClient object, passing app’s api key and 
  // a site relative url to xd_receiver.htm 
  
  var api = null;

  init();

  function init() {
    api = new FB.ApiClient('88f61278db03559135c4b95c95c2a2aa', 
      'xd_receiver.htm', null); 
  }
  

  function acallback(result, exception) {
    alert('hey');
  }
  
  // require user to login
  api.requireLogin(function(exception) {
    console.log('Current user id is ' + api.get_session().uid);    

    var method = 'friends.get';
    var parameters = null;
    var jsonRequest = api._generateJsonRequest(method, parameters);
    
    console.log(jsonRequest);
    
    jsonRequest.callback = Delegate.create(api, function(result, exception) {
      var apiError = result;
      if (!exception && !isUndefined(apiError.error_code)) {
        FB.FBDebug.assert(false, 'API error');
        exception = Error.create(apiError.error_msg, apiError);
        result = null;
      }
      acallback(result, exception);
    });
    jsonRequest.sendRequest();  

  });

  function getSession() {
    return api.session;
  }

  function getFriends() {
    console.log(api);
    // Get friends list 
    api.friends_get(function(result, exception) {
      Debug.dump(result, 'friendsResult from non-batch execution ');  
    });
  }
})();
