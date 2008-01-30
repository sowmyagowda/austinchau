(function() {
  jQuery(document).ready(function() {
    jQuery.getScript(
        'http://static.ak.facebook.com/js/api_lib/FacebookApi.debug.js', 
        main);   
  });
  
  var api = null;

  function main() {  
  
    api = new FB.ApiClient('88f61278db03559135c4b95c95c2a2aa', 
        '/svn/trunk/facebook/js/xd_receiver.htm', null);
    
    api.requireLogin(function(exception) {

      var myId = api.get_session().uid;

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

      jQuery('#test').click(function() {
        test();
      });
    });

  }

  function clear() {
    jQuery('#display').empty();
  }

  function test() {
    var sequencer = new FB.BatchSequencer();

    var s1 = api.friends_get(sequencer);
    var s2 = api.notifications_get(sequencer);

    sequencer.execute(function() {
      console.log(s1.result);
      console.log(s2.result);
    });
  }

  function getPhotoAlbums() {

    api.friends_get(function(users, exception) {

      users = users.slice(0, 10);
      
      for (var i=0;i<users.length;i++) {
        var uid = users[i];
        api._callMethod$1('photos.getAlbums', {uid: uid}, 
            function(result, exception) {
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
      
      users = users.slice(0, 10);

      var fields = ['birthday', 'name', 'pic_big', 'relationship_status'];

      api.users_getInfo(users, fields, function(result, exception) {

        var re = /([a-zA-Z]+) ([0-9]{1,2})(, [0-9]{4})*/;

        var chart = {};
        chart.width = 1000;
        chart.height = 300;
        chart.title = 'birthday';
        chart.color = '6633FF';
    
        chart.data = [];
  

        for (var i=0;i<result.length ;i++ ) {
          var userInfo = result[i];
          var name = userInfo['name'];
          var birthday = userInfo['birthday'];
          var pic = userInfo['pic_big'];
          var relStatus = userInfo['relationship_status'];

          display(name);
          
          if (relStatus) { 
            display(relStatus);
          } else {
            display('status = null');
          }

          if (birthday) {
            birthday.match(re);

            var birthdayMonth = RegExp.$1;
            var birthdayDate = RegExp.$2;
            
            if (chart.data[birthdayMonth] != undefined) {
              chart.data[birthdayMonth]++;
            } else {
              chart.data[birthdayMonth] = 1;
            }

            display('birthday: month = ' + birthdayMonth + 
                ' date = ' + birthdayDate);
          } else {
            display('birthday = null');
          }
          if (pic) {
            jQuery('<img />').attr({src: pic}).appendTo('#display');
          } else {
            display('image = null');
          }

          display('<br />');
        }

        console.log(chart);

        var chartUrl = googlechart.createPieChart(chart);

        jQuery('<img />').attr({src: chartUrl}).appendTo('#display');

        display('<br />');
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
