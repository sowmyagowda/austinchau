(function() {
  
  google.load('gdata', '1.x');
  google.setOnLoadCallback(gdataInit);
  
  var api = null;
  var facebookId = '88f61278db03559135c4b95c95c2a2aa';

  var calendarService = null;

  var MONTHS = [
  'January', 'Feburary', 'March', 
  'April', 'May', 'June', 
  'July', 'August', 'September',
  'October', 'November', 'December'];
  
  function gdataInit() {

    calendarService = new google.gdata.calendar.CalendarService('TEST');    

    if (hasToken()) {
      jQuery('#gdatalogin').val('gcal logout');
    } else {
      jQuery('#gdatalogin').val('gcal login');
    }

    jQuery('#gdatalogin').click(function() {
      if (hasToken()) {
        google.accounts.user.logout();
        jQuery('#gdatalogin').val('gcal login');
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

    api = new FB.ApiClient(facebookId, 
        '/svn/trunk/facebook/js/xd_receiver.htm', null);
    
    api.requireLogin(function(exception) {

      myId = api.get_session().uid;

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

  function getFQL() {
   
    var friendList = jQuery('<select id=friendlist/>');

    jQuery('#display').append(friendList);

    var fql = 'SELECT name,uid FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1=' + myId + ')';

    api.fql_query(fql, function(result, exception) {

      for (var i=0; i<result.length; i++) {
        //var friend = result[i];
        //displayFriend(friend);
        
        var friendName = result.anme;
        var friendUid = result.uid;

        var friendOption = jQuery('<option/>');
        friendOption.attr({value: friendUid});
        friendOption.html(friendName);
      }

    });
  }

  function displayFriend(friend) {
    var name = friend.name;
    var uid = friend.uid;

    var friendDiv = jQuery('<div></div>');
    
    friendDiv.append(name);

    jQuery('#display').append(friendDiv);

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
            
            button = jQuery('<input type=button value=add>');

            button.click(function() {
              var now = new Date();
              var dateObject = new Date(now.getFullYear(),
                  MONTHS.indexOf(birthdayMonth), birthdayDate);            
              createEvent(name + '\'s birthday', dateObject, pic);
            });            

            jQuery('#info').append('<br>');
            jQuery('#info').append(button);
          }


        }

      });
    });
  }

  function createEvent(title, d, pic) {
    
    var feedUri = 'http://www.google.com/calendar/feeds/default/private/full';

    var entry = new google.gdata.calendar.CalendarEventEntry();

    entry.setTitle(google.gdata.Text.create(title));

    var when = new google.gdata.When();

    var startTime = new google.gdata.DateTime(d, true);
    var oneday = 24 * 60 * 60 * 1000;
    var d_ = new Date();
    d_.setTime(d.getTime() + oneday);
    var endTime = new google.gdata.DateTime(d_, true);
    when.setStartTime(startTime);
    when.setEndTime(endTime);

    entry.addTime(when);

    var wc = new google.gdata.calendar.WebContent();
    wc.height = 300;
    wc.width = 300;
    wc.setUrl(pic);

    var wcl = google.gdata.calendar.CalendarLink.create(wc, pic, title, 'image/*');

    entry.setWebContentLink(wcl);


    var callback = function(result) {
      alert('event created!');
      }

    var handleError = function(error) {
      alert(error);
    }

    calendarService.insertEntry(feedUri, entry, callback, 
        handleError, google.gdata.calendar.CalendarEventEntry);

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
