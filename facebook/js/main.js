(function() {
  
  google.load('gdata', '1.x');
  google.setOnLoadCallback(gdataInit);
  
  var api = null;
  var myId = null;

  var calendarService = null;

  var MONTHS = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July',
  'August', 'September',
  'October', 'November', 'December'];
  
  function gdataInit() {

    calendarService = new google.gdata.calendar.CalendarService('TEST');    

    if (hasToken()) {
      jQuery('#gdatalogin').val('logout');
    } else {
      jQuery('#gdatalogin').val('login');
    }

    jQuery('#gdatalogin').click(function() {
      if (hasToken()) {
        google.accounts.user.logout();
        jQuery('#gdatalogin').val('login');
      } else {
        google.accounts.user.login('http://www.google.com/calendar/feeds/');
      }
    });



    jQuery.getScript(
        'http://static.ak.facebook.com/js/api_lib/FacebookApi.debug.js', 
        main);   
  }

  function hasToken() {
    return google.accounts.user.checkLogin('http://www.google.com/calendar/feeds/');
  }

  function main() {  

    jQuery('#info').draggable();

    api = new FB.ApiClient('88f61278db03559135c4b95c95c2a2aa', 
        '/svn/trunk/facebook/js/xd_receiver.htm', null);
    
    api.requireLogin(function(exception) {

      myId = api.get_session().uid;

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
      
      jQuery('#fql').click(function() {
      
        getFQL();
      });

      jQuery('#test').click(function() {
        test();
      });
    });

  }

  function clear() {
    jQuery('#display').empty();
  }

  function displayFriend(friend) {
    var name = friend.name;
    var uid = friend.uid;

    var friendDiv = jQuery('<div></div>');
    
    friendDiv.append(name);
    friendDiv.append('<br>');
    //friendDiv.append(uid);

    jQuery('#display').append(friendDiv);
    jQuery('#display').append('<br>');

    friendDiv.click(function() {
      var fql = 'SELECT birthday,pic,pic_big FROM user WHERE uid=' + uid;      
      api.fql_query(fql, function(result, exception) {
        var birthday = null;
        var pic = null;
        var birthdayMonth = null;
        var birthdayDate = null;

        if (result.length > 0) {

          jQuery('#info').empty();
          birthday = result[0].birthday;
          pic = result[0].pic_big;
          
          var re = /([a-zA-Z]+) ([0-9]{1,2})(, [0-9]{4})*/;
          
          if (birthday) {
            birthday.match(re);
            birthdayMonth = RegExp.$1;
            birthdayDate = RegExp.$2;
          } else {
            birthdayMonth = null;
            birthdayDate = null;
          }
         
          jQuery('#info').append('<img src="' + pic + '"><br>');
          jQuery('#info').append(name + '<br>');          
          jQuery('#info').append(birthdayMonth + '<br>');
          jQuery('#info').append(birthdayDate + '<br>');
          
          if (birthdayMonth && birthdayDate) {
            var now = new Date();
            var dateObject = new Date(now.getFullYear(),
                MONTHS.indexOf(birthdayMonth), birthdayDate);            

            jQuery('#info').append(dateObject.toString());
          }


        }

      });
    });
  }

  function getFQL() {
    
    var fql = 'SELECT name,pic_small,uid FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1=' + myId + ')';

    api.fql_query(fql, function(result, exception) {

      for (var i=0; i<result.length; i++) {
        var friend = result[i];
        displayFriend(friend);
      }

    });
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
    api.photos_get('2541844', null, null, function(photos, exception) {
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
      
      //users = users.slice(0, 100);

      var fields = ['birthday', 'name', 'pic_big', 'relationship_status'];

      api.users_getInfo(users, fields, function(result, exception) {

        var re = /([a-zA-Z]+) ([0-9]{1,2})(, [0-9]{4})*/;

        var chartData = [];
        chartData.type = 'p';
        chartData.width = '1000';
        chartData.height = '300';
        chartData.title = 'Birthday Months Breakdown';
        chartData.color = '333333';
        chartData.items = [];

        for (var i=0;i<result.length ;i++ ) {
          var userInfo = result[i];
          var name = userInfo['name'];
          var birthday = userInfo['birthday'];
          var pic = userInfo['pic_big'];
          var relStatus = userInfo['relationship_status'];

          var birthdayMonth = null;
          var birthdayDate = null;

          display(name);
          
          if (relStatus) { 
            display(relStatus);
          } else {
            display('status = null');
          }

          if (birthday) {
            birthday.match(re);
            birthdayMonth = RegExp.$1;
            birthdayDate = RegExp.$2;
          } else {
            birthdayMonth = 'N/A';
            birthdayDate = 'N/A';
          }

          display('birthday: month = ' + birthdayMonth + 
              ' date = ' + birthdayDate);

          chartData.items.push({name: birthdayMonth, label: birthdayMonth});

          if (pic) {
            jQuery('<img />').attr({src: pic}).appendTo('#display');
          } else {
            display('image = null');
          }

          display('<br />');
        }

        var chartUrl = googlechart.getChartUrl(chartData);
        jQuery('<img src="' + chartUrl  + '">').appendTo('#display');
        display('<br />');
      });

    });
   
  }

  function getAllFriends() {
    clear();


    api.friends_get(null, function(result, exception) {

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
