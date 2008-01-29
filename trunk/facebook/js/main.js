(function() {

  jQuery(document).ready(function() {
    jQuery.getScript('http://static.ak.facebook.com/js/api_lib/FacebookApi.debug.js', 
        main);   
  });

  var api = null;

  function main() {  

    api = new FB.ApiClient('88f61278db03559135c4b95c95c2a2aa', 
        '/svn/trunk/facebook/js/xd_receiver.htm', null);
    
    // require user to login
    api.requireLogin(function(exception) {

      var myId = api.get_session().uid

      display('my id: ' + myId);    

      jQuery('#clear').click(function() {
        clear();
      });

      jQuery('#getallfriends').click(function() {
        getAllFriends();
      });

      jQuery('#getappusers').click(function() {
        getAppUsers();
      });

      jQuery('#getuserinfo').click(function() {
        getUserInfo();
      });

			jQuery('#getalbums').click(function() {
			
				getPhotoAlbums();
			});

			jQuery('#getphotos').click(function() {
			
				getPhotos();
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

  function getPhotoAlbums() {

		api.friends_get(function(users, exception) {

			users = users.slice(0, 10);
			
			for (var i=0;i<users.length;i++) {
				var uid = users[i];
				api._callMethod$1('photos.getAlbums', {uid: uid}, function(result, exception) {
					if (result.length > 0) {
						var aid = result[0].aid;
					  console.log(aid);
					}
				
				});
			}
			
		});

    return;

    api.photos_getAlbums('628919908', null, function(result, exception) {
      console.log(result);
    });

  }

	function getPhotos() {
		api.photos_get('1503528', null, null, function(photos, exception) {
			for (var i = 0; i < photos.length; i++) {
				var photo = photos[i];
				var src = photo.src_big;
				jQuery('<img />').attr({src: src}).appendTo('#display');
				display('<br>');
			}
		});
	}

  function getUserInfo() {  

    clear();

    api.friends_get(function(users, exception) {
      
      users = users.slice(0, 50);

      var fields = ['birthday', 'name', 'pic'];

      var parameters = {};
      parameters['uids'] = users.toString();
      parameters['fields'] = fields.toString();
      api._callMethod$1('users.getInfo', parameters, function(result, exception) {

				var re = /([a-zA-Z]+) ([0-9]{1,2})(, [0-9]{4})*/;

        for (var i=0;i<result.length ;i++ ) {
          var userInfo = result[i];
          var name = userInfo['name'];
          var birthday = userInfo['birthday'];
          var pic = userInfo['pic'];
					
					display(name);

					if (birthday) {
						birthday.match(re);

						var birthdayMonth = RegExp.$1;
						var birthdayDate = RegExp.$2;

          	display(birthdayMonth);
						display(birthdayDate);					
					} else {
						display('birthday = null');
					}

          jQuery('<img />').attr({src: pic}).appendTo('#display');
          display('<br />');


        }


      });

      return;
      
      api.users_getInfo(users, fields, function(result, exception) {

        display(result.birthday);

      }); 

    });

   
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
