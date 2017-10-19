<?php
$json_string = file_get_contents('php://123.txt');
$data_array = json_decode($json_string, true);
?>
