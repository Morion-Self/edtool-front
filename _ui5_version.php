<?php

// Нужно включать этот файл во всех приложениях, где юзаю ui5
// Чтобы версия была одна и та же


// Проверять версию тут: https://openui5.org/releases/
// А вообще все версии есть вот тут: https://openui5.hana.ondemand.com/versionoverview.html

// Когда качаешь новую версию, нужно:
// 1. Зайти в папку <version>/resources/
// 2. ln -s ../resources/ sap-ui-cachebuster

$ui5_version = '1.96.2';
$ui5_url = ($_SERVER['HTTP_HOST'] == 'localhost') ? ("/openui5/" . $ui5_version) : ("https://openui5.hana.ondemand.com/" . $ui5_version);
