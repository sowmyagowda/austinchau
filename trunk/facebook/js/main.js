(function() {
   
  jQuery(document).ready(function() {
    jQuery.getScript('http://static.ak.facebook.com/js/api_lib/FacebookApi.debug.js', 
        main);   
  });

  var api = null;

  function main() {  

    api = new FB.ApiClient('88f61278db03559135c4b95c95c2a2aa', 
        '/xd_receiver.htm', null);
    
    // require user to login
    api.requireLogin(function(exception) {

      var myId = api.get_session().uid

      console.log('my id: ' + myId);    

      jQuery('#clear').click(function() {
        clear();
      });

      jQuery('#getallfriends').click(function() {
        getAllFriends();
      });

      jQuery('#getappusers').click(function() {
        getAppUsers();
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

  }

  function clear() {
    jQuery('#display').empty();
  }

  function getAllFriends() {
    clear();
    api.friends_get(function(result, exception) {

      for (var i=0; i<result.length ;i++ ) {
        var friendId = result[i];
        display(friendId);
      }

    });
  }

  function getAppUsers() {
    clear();
    api.friends_getAppUsers(function(result, exception) {

      for (var i=0;i<result.length;i++ ) {
        var userId = result[i];
        display(userId);
      }
    });
  }

  function display(text) {
    jQuery('#display').append(text + '<br>');
  }

})();
