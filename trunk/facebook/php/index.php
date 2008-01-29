<?php ob_start(); ?>

<html>
 <head>
  <title>Facebook JS App</title>
  <meta name="Generator" content="EditPlus">
  <meta name="Author" content="">
  <meta name="Keywords" content="">
  <meta name="Description" content="">
  <link rel="stylesheet" type="text/css" href="style.css" />
  <script type="text/javascript" src="http://code.google.com/js/jquery.js"></script>
  <script type="text/javascript" src="main.js"></script>
 </head>   
 <body>

  <?php
    /*
    require_once 'facebook.php';

    $appapikey = '88f61278db03559135c4b95c95c2a2aa';
    $appsecret = '61daf02e3ae3a55652b09826b3e5afba';

    $facebook = new Facebook($appapikey, $appsecret);
    $user_id = $facebook->require_login();
    

    echo 'your id is: ' . $user_id . '<br>';
    
    $friends = $facebook->api_client->friends_get();

    $fields[] = 'birthday';
    $fields[] = 'name';

    $infos = $facebook->api_client->users_getInfo($friends, $fields);

    foreach($infos as $friend) {
      echo '<pre>';
      print_r($friend);
      echo '</pre>';      
    }
    */
  ?>
  
  <input type=button id=getallfriends value='getAllFriends'> &nbsp;
  <input type=button id=getappusers value='getAppUsers'><br>  
  <br>
  <input type=button id=clear value='clear'><br><br> 
  <div id=display></div>
 </body>
</html>

<?php ob_flush(); ?>