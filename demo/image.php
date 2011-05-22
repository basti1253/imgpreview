<?php

sleep(2);
$img = "rambo-tux.png";

ob_start();
header( "Pragma: public");
header( "Expires: 0" );
header( "Cache-Control: no-cache, must-revalidate" );
header( "Content-Type: image/png" );
header( "Content-Disposition: attachment; filename=\"" . basename( $img ) . "\";" );
header( "Content-Transfer-Encoding: binary" );

readfile( $img );
header( "Content-Length: " . ob_get_length() );
ob_end_flush();
