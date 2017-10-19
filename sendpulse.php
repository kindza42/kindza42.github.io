<?php
$json_string = file_get_contents('php://input');
$data_array = json_decode($json_string, true);
?>