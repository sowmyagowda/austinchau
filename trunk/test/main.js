(function() {
  var SCOPE_URL = 'http://www.google.com/calendar/feeds/';
  var calendarService = null;

  google.load('gdata', '1.x');
  google.load('feeds', '1');

  google.setOnLoadCallback(init);

  function init() {

    if (isTokenRedirect()) {
      $('body').css({visibility: 'hidden'});
      return;
    }

    initTabs(); 
  }  

  function initTabs() {
    $("#tabs > ul").tabs();
    initCalendarTab();
    initMoviesTab();
    initNBATab();
	  initChart();
    initTest();    
  }
 

  function getImages(tags) {
    $.getJSON(
        "http://api.flickr.com/services/feeds/photos_public.gne?tags=" + 
        encodeURI(tags) + "&tagmode=any&format=json&jsoncallback=?", 
        function(data){        

          $.each(data.items, function(i,item){
            $("<img/>").attr("src", item.media.m).appendTo("#moviedisplay").click(
                function() {                  
                  var description = item.description;
                  description = description.replace(/&lt;/g,"<");
                  description = description.replace(/&gt;/g,">");  
                  description = description.replace(/&quot;/g,"\"");              
                  //alert(description);
                  alert(tags);
                }
            );
          });
        }
   );
  }
  
  function initCalendarTab() {
    calendarService =
      new google.gdata.calendar.CalendarService('Calendar_JS_Guide');

    $('#login').click(function() {
      if (hasCalendarToken()) {
        google.accounts.user.logout();
        $('#login').val('login');
        setEnabledRun(false);
      } else {
        google.accounts.user.login(SCOPE_URL);
      }
    });

    if (hasCalendarToken()) {

      // init calendarChooser
      initCalendarChooser();

      setEnabledRun(true);
      $('#login').val('logout');
    } else {
      setEnabledRun(false);
      $('#login').val('login');
    }

    $('#run').click(function() {
      run();   
    });

    // init datepicker
    $('#startdate').datepicker({dateFormat: 'YMD-'}); 
    $('#enddate').datepicker({dateFormat: 'YMD-'}); 

  }

  
  function initTest() {    

    $('#test').click(function() {
      
      if ($.draggable != undefined) {
        return;
      }

      $.getScript('http://dev.jquery.com/view/tags/ui/1.0.1a/jquery.dimensions.js',
        function() {
          $.getScript('http://dev.jquery.com/view/tags/ui/1.0.1a/ui.mouse.js',
            function() {
              $.getScript('http://dev.jquery.com/view/tags/ui/1.0.1a/ui.draggable.js',
                function() {
                  $.getScript('http://dev.jquery.com/view/tags/ui/1.0.1a/ui.draggable.ext.js',
                    function() {
                      $('#testdisplay').draggable();
                  });
              });
          });
      });
    });
  }

  function initChart() {

    $('#chart').click(function() {
      
    });

    var pieChart = new googlechart.Chart('p','Test', 1000,300, '333333');
    pieChart.addData('May', 'May');
    pieChart.addData('June', 'June');
    pieChart.addData('May', 'May');

    var imageUrl = pieChart.getChartUrl();

    $('#chartdisplay').append('<img src="' + imageUrl + '"><br>');
  }

  function initMoviesTab() {

    $('#getmovies').click(function() {
      var feed = new google.feeds.Feed('http://rss.ent.yahoo.com/movies/boxoffice.xml');
      feed.setNumEntries(100);
      feed.load(function(result) {

        if (!result.error) {
          
          $('#moviedisplay').empty();
          for (var i = 0; i < result.feed.entries.length; i++) {
            var entry = result.feed.entries[i];
            var title = entry.title;
            var description = entry.content;
            var link = entry.link;
            
            var re = /[0-9]+\. (.+) - (\$[0-9\.]+M)/;

            title.match(re);

            var movieTitle = RegExp.$1;
            var totalSale = RegExp.$2;

            $('#moviedisplay').append(movieTitle + '  <font color="green">' + totalSale + '</font><br>');

           //getImages(movieTitle);


          }
        }
      });
    });
  }

  function initNBATab() {

    $('#getnbagames').click(function() {
      var feed = new google.feeds.Feed('http://www.nba.com/scores/rss.xml');
      feed.setNumEntries(100);
      feed.load(function(result) {

        if (!result.error) {

          $('#nbagamesdisplay').empty();

          for (var i = 0; i < result.feed.entries.length; i++) {
            var entry = result.feed.entries[i];
            var title = entry.title;
            var description = entry.content;
            var link = entry.link;
            
            var linkRE = /\/([0-9]{4})([0-9]{2})([0-9]{2})\//;

            link.match(linkRE);
            
            var gameYear = RegExp.$1;
            var gameMonth = RegExp.$2 - 1;
            var gameDay = RegExp.$3;
            var gameDate = new Date(gameYear, gameMonth, gameDay);

            var titleRE = /^([ 0-9a-zA-Z]+) ([0-9]+), ([ 0-9a-zA-Z]+) ([0-9]+)/;

            title.match(titleRE);

            var team1 = RegExp.$1;
            var team1Score = RegExp.$2;
            var team2 = RegExp.$3;
            var team2Score = RegExp.$4;

            $('#nbagamesdisplay').append(gameDate + '<br>');            
            $('#nbagamesdisplay').append(link + ' --- ' +
                team1 + ' ' + team1Score + ' ' + team2 + ' ' + team2Score + '<br>');

          }
        }
      });
    });
  }

  
	function initCalendarChooser() {

    var feedUrl = 'http://www.google.com/calendar/feeds/default/allcalendars/full/';
    calendarService.getAllCalendarsFeed(
        feedUrl,
        function(root) {
          var entries = root.feed.entry;

          for (var i = 0; i < entries.length ; i++) {
            var entry = entries[i];
            var id = entry.getId().getValue().replace(feedUrl, '');
            var title = entry.getTitle().getText();
            var accessLevel = entry.getAccessLevel().getValue();

            var option = ['<option value="', id, '">', title, '</option>'].join('');
            $('#calendarchooser').append(option);

          }
        },
        handleError);        
  }

  function run() {
    getAllEvents();
  }

  function displayChart(events) {

    var pieChart = new googlechart.Chart('p', 'Total Events', 1000, 300, '6633FF');
    
    for (var author in events) {
      var author = events[author];
      pieChart.addData(author, author);
    }    
  
    var chartUrl = pieChart.getChartUrl();
    var image = '<img src="' + chartUrl + '">';

    $('#chart').empty();
    $('#chart').append(image + '<br>');
  }

  function getAllEvents() {

    var calId = $('#calendarchooser').get(0).options[$('#calendarchooser').get(0).selectedIndex].value;
    var visibility = $('#visibility').get(0).options[$('#visibility').get(0).selectedIndex].value;

    var feedUrl = ['http://www.google.com/calendar/feeds/', calId, 
        '/', visibility, '/', 'full'].join('');

    //console.log(feedUrl);

    var events = {};  

    var query = new google.gdata.calendar.CalendarEventQuery(feedUrl);
    query.setMaxResults(100);
    query.setOrderBy('starttime');
    query.setSortOrder('a');


    var startDate = $('#startdate').val();
    var endDate = $('#enddate').val();

    if (startDate && endDate) {
      query.setMinimumStartTime(startDate);
      query.setMaximumStartTime(endDate);
    }

    calendarService.getEventsFeed(
      query, 
      function(root) {
           
        var entries = root.feed.getEntries();                
        var output = [];
            
        for (var i=0;i<entries.length ;i++ ) {
          var entry = entries[i];

          var eventTitle = entry.getTitle().getText();
          var eventTime = (entry.getTimes().length > 0) ? entry.getTimes()[0].getStartTime().getDate(): undefined;
          var eventLocation = (entry.getLocations().length > 0) ? entry.getLocations()[0].getValueString(): undefined;
          var eventAuthorEmail = (entry.getAuthors().length > 0) ? entry.getAuthors()[0].getEmail().getValue(): undefined;
          var eventAuthorName = (entry.getAuthors().length > 0) ? entry.getAuthors()[0].getName().getValue(): undefined;

          if (events[eventAuthorEmail] != undefined) {
            events[eventAuthorEmail]++;
          } else {
            events[eventAuthorEmail] = 1;
          }

          output.push('title = ' + eventTitle);
          output.push('<br>');
          output.push('time = ' + eventTime);
          output.push('<br>');
          output.push('name = ' + eventAuthorName);
          output.push('<br>');
          output.push('email = ' + eventAuthorEmail);
          output.push('<br>');
          output.push('location = ' + eventLocation);
          output.push('<br><br>');
        }    
        
        displayChart(events);
        output = output.join('');
        setCalendarDisplay(output);
      }, 
      handleError
    );  
  }

  function setCalendarDisplay(text) {
    $('#display').html(text);
  }

  function setEnabledRun(bool) {
    $('#runnable > *').each(function() {
      $(this).get(0).disabled = !bool;
    });
  }

  function hasCalendarToken() {
    if (google.accounts.user.checkLogin(SCOPE_URL) === '') {
      return false;
    }
    return true;
  }

  function isTokenRedirect() {

    var status = false;
    var url = window.location.href;
    var matchArr = url.match(/#2/);

    if (matchArr != null) {
      status = true;
    }

    return status;
  }

  function handleError(e) {

    e.cause ? e.cause.statusText : e.message;
    setCalendarDisplay(e.cause);
    //alert("There was an error!");
    //alert(;
  }

})();
