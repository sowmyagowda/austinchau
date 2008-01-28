(function() {
  // Create an ApiClient object, passing app�s api key and 
  // a site relative url to xd_receiver.htm 
  
  var api = null;

  init();

  function init() {
    api = new FB.ApiClient('88f61278db03559135c4b95c95c2a2aa', 
      '/xd_receiver.htm', null); 
  }
  

  function acallback(result, exception) {
    alert('hey');
  }
  
  // require user to login
  api.requireLogin(function(exception) {
    console.log('Current user id is ' + api.get_session().uid);    

    getFriends();

  });

  function getSession() {
    return api.session;
  }

  function getFriends() {
    console.log(api);
    // Get friends list 
    api.friends_get(function(result, exception) {
      console.log('friends.get');
      Debug.dump(result, 'friendsResult from non-batch execution ');  
    });
  }
})();
