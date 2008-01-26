var SCOPE_URL = 'http://www.google.com/calendar/feeds/';
var calendarService =
  new google.gdata.calendar.CalendarService('test');

var button = document.getElementById('loginout');
button.onclick = function() {
  if (google.accounts.user.checkLogin(SCOPE_URL)) {
    this.value = 'Calendar Login;
    google.accounts.user.logout();       
  } else {
    this.value = 'Calendar Logout';
    google.accounts.user.login(SCOPE_URL);       
  }    
}