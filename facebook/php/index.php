<?php ob_start(); ?>

<html>
 <head>
  <title>Facebook PHP App</title>
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
    require_once 'facebook.php';

    $appapikey = '01dab21b45b28fd1ac4ffc6d8c75f970';
    $appsecret = '14376d6e250c7683e10ae35e155037e2';

    $facebook = new Facebook($appapikey, $appsecret);
    $user_id = $facebook->require_login();
    

    echo 'your id is: ' . $user_id . '<br>';

    $friends = $facebook->api_client->friends_getAppUsers();

    $fields[] = 'birthday';
    $fields[] = 'name';
    $fields[] = 'about_me';

    $infos = $facebook->api_client->users_getInfo($friends, $fields);

    foreach($infos as $friend) {

      $uid = $friend['uid'];
      $birthday = $friend['birthday'];
      $name = $friend['name'];

      $photos = $facebook->api_client->photos_getAlbums($uid);

      echo '<pre>';
      print_r($photos);
      echo '</pre>';      
    }

  ?>
  
  <div id=display></div>
 </body>
</html>

<?php ob_flush(); ?>
