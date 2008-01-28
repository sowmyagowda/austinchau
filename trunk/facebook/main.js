(function() {
  // Create an ApiClient object, passing app’s api key and 
  // a site relative url to xd_receiver.htm 
  
  jQuery(document).ready(function() {
    
    var api = null;

    init();

    function init() {
      api = new FB.ApiClient('88f61278db03559135c4b95c95c2a2aa', 
        '/xd_receiver.htm', null); 
    }  
    
    // require user to login
    api.requireLogin(function(exception) {

      var myId = api.get_session().uid

      console.log('my id: ' + myId);    

      getFriends();



      api.friends_getAppUsers(function(result, exception) {
        console.log(result);

        for (var i=0;i<result.length;i++ ) {
          var userId = result[i];
          jQuery('#display').append(userId + '<br>');
        }

        api.users_getInfo(result[0], ['birthday'], function(result, exception) { 
          console.log(result); 
        });       
      });

      /*
      api.users_getLoggedInUser(function(result, exception) {
        console.log(result);
      });
      */

      /*
      api.notifications_get(function(result, exception) {
        console.log(result);
      });
      */



    });

    function getFriends() {
      // Get friends list 
      api.friends_get(function(result, exception) {
        
        var friend = result[0];

        for (var i=0; i<result.length ;i++ ) {
          var friendId = result[i];
          //console.log(friendId);
          //jQuery('#display').append(friendId + '<br>');
          
          /*
          api.users_getInfo(friendId, 'birthday', function(result, exception) {
            if (!result) {
              console.log(result);
            }
            //console.log(result);
            //console.log(exception);
          });
          */
        }

      });
    }
  });

})();
