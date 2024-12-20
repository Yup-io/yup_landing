<?php

/* SETTINGS */
$recipient = "community@yup.io";
$subject = "New Message from Contact Form";

if($_POST){

  /* DATA FROM HTML FORM */
  $name = $_POST['name'];
  $email = $_POST['email'];
  $message = $_POST['message'];
  //  How to add a new input to the email template:
  //  1) Use the template below by replacing the "phone" with the value of your <input> name attribute:
  //  $phone = $_POST['phone'];
  //  Continue to line #41...


  /* SUBJECT */
  $emailSubject = $subject . " by " . $name;

  /* HEADERS */
  $headers = "From: $name <$email>\r\n" .
             "Reply-To: $name <$email>\r\n" .
             "Subject: $emailSubject\r\n" .
             "Content-type: text/plain; charset=UTF-8\r\n" .
             "MIME-Version: 1.0\r\n" .
             "X-Mailer: PHP/" . phpversion() . "\r\n";

  /* PREVENT EMAIL INJECTION */
  if ( preg_match("/[\r\n]/", $name) || preg_match("/[\r\n]/", $email) ) {
    header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
    die("500 Internal Server Error");
  }

  /* MESSAGE TEMPLATE */
  // You will receive an email in the following template:
  $mailBody = "Name: $name \n\r" .
              "Email:  $email \n\r" .
              "Subject:  $subject \n\r" .
          //  2) Add the title (Phone: ) and the variable ($phone) for each new <input> of your html template:
          //  "Phone:  $phone \n\r" .
              "Message: $message";

  /* SEND EMAIL */
  mail($recipient, $emailSubject, $mailBody, $headers);
}
?>
