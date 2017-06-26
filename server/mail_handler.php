<?php

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    @$name = $request->name;
    @$phone = $request->phone;
    @$email = $request->email;
    @$website = $request->website;
    @$business = $request->business;
    @$followUp = $request->followUp;
    @$services = $request->services;
    @$other = $request->other;

    $to='jamesbryantobrien@gmail.com'; // Receiver Email ID, Replace with your email ID
    $subject='Oneiros Inquiry | '.$business;
    $message="Name :".$name."\n"."Phone :".$phone."\n"."Email :".$email."\n"."Website :".$website."\n"."Follow Up :".$followUp."\n"."Services :".$services."\n"."Wrote the following :"."\n\n".$other;
    $headers="From: contact@oneirossolutions.com";

    mail($to, $subject, $message, $headers);
?>