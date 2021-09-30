<?php
include $_SERVER['DOCUMENT_ROOT'] . '/backend/core/Session.php';
$session = new Session();
// \ehSession\start();
?>


<!DOCTYPE HTML>
<html>

<head>
    <?php
    $y = '_yandexMetrika.php';
    if (file_exists($y))
        include $y;
    ?>

    <title>edTool — Инструменты для редакторов, авторов, и всех, кто работает с контентом</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta charset="UTF-8">
    <link rel="shortcut icon" href="favicon.png" type="image/x-icon">

    <link rel="stylesheet" href="css/style.css" type="text/css" media="all" />

    <!-- https://openui5.hana.ondemand.com/1.84.18/resources/sap-ui-core.js -->
    <script src="./openui5/1.84.18/resources/sap-ui-core.js" id="sap-ui-bootstrap" data-sap-ui-libs="sap.m" data-sap-ui-theme="sap_fiori_3" data-sap-ui-bindingSyntax="complex" data-sap-ui-preload="async" data-sap-ui-resourceroots='{
                "eh": "./",
                "eh.modules": "./modules",
                "eh.lib": "./lib"
            }'></script>

    <?php

    // если пользователь залогинен - показыаем ему приложение
    if ($session->getUserID() !== false) {
        echo '
                <script>
                    sap.ui.getCore().attachInit(function() {
                        new sap.ui.core.ComponentContainer({
                            name : "eh",
                            settings: {
                                id: "component"
                            }
                        }).placeAt("content");
                    });
                </script>';
        // иначе - index страницу
    } else {
        echo '
                <script>
                    sap.ui.getCore().attachInit(function() {
                        new sap.m.App({
                            pages: [
                                sap.ui.xmlview({
                                    viewName : "eh.modules.index.index",
                                    type: sap.ui.core.mvc.ViewType.XML
                                })
                            ]
                        }).placeAt("content");
                    });
                </script>';
    }
    ?>
</head>

<body class="sapUiBody" role="application">
    <div id="content" />

</body>

</html>