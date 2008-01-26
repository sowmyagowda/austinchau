
  var SCOPE_URL = 'http://www.google.com/calendar/feeds/';
  var FEED_URL = 'http://www.google.com/calendar/feeds/default/private/full';
  var calendarService = null;
  var objectInspector = null;

  google.load('gdata', '1.x');
  google.setOnLoadCallback(init);

  function init() {

    if (isTokenRedirect()) {
      $('body').css({visibility: 'hidden'});
      return;
    }

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

      setEnabledRun(true);
      $('#login').val('logout');
    } else {
      setEnabledRun(false);
      $('#login').val('login');
    }

    $('#run').click(function() {
      run();   
    });

    $('#clear').click(function() {
      CLEAR();   
    });

    CodePress.run();
    
    initTabs();
  }  

  function initTabs() {
    $("#tabs > ul").tabs();
  }

  function codePressOnLoad() {

    return;

    var args = getUrlArgs();

    var file = args.file;
    loadSourceCode(file);
  }

  function loadSourceCode(file) {
    sourcecode.setCode('loading...');
    
    $.ajax({
      url: 'script/' + file,
      cache: false,
      success: function(text){

        var newLineCount = 0;

        for (var i = 0;i < text.length ;i++) {
          var c = text.charAt(i);

          if (c == '\n') {
            newLineCount++;
          }
        }

        sourcecode.style.height = newLineCount * 18;
        sourcecode.setCode(text);
        sourcecode.editor.syntaxHighlight('init');
      }
    }); 
  }

  function run() {
    var code = sourcecode.getCode();
    eval(code);

    $("#tabs > ul").tabsClick(2);
  }

  function PRINT(text) {
    $('#display').append(text);
  }

  function CLEAR() {
    $('#display').empty();
  }

  function setEnabledRun(bool) {
    $('#run').get(0).disabled = !bool;
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
    setDisplay(e.cause);
    //alert("There was an error!");
    //alert(;
  }

  /**
   * Grab and parse the arguments of the URL after '#'
   * @return {Object} An object that maps all the argument names and values
   */
  function getUrlArgs() {
    var args = new Object();
    var params = window.location.href.split('#');

    if (params.length > 1) {
      params = params[1];
      var pairs = params.split("&");
      for ( var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('=');
        if ( pos == -1 ) continue;
        var argname = pairs[i].substring(0, pos);
        var value = pairs[i].substring(pos + 1);
        value = value.replace(/\+/g, " ");
        args[argname] = value;
      }
    }
    return args;
  }

