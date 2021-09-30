<?php
    include $_SERVER['DOCUMENT_ROOT'] . '/backend/core/Session.php';
    $session = new Session();
?>

<!DOCTYPE HTML>
<html>
<head>

<?php
    $y = $_SERVER['DOCUMENT_ROOT'] . '/_yandexMetrika.php';
    if (file_exists($y)) {
        include $y;
    }

    $title = 'edTool — Инструменты для редакторов, авторов, и всех, кто работает с контентом';
    $description = 'Инструменты для редакторов, авторов, и всех, кто работает с контентом';
    $og_image = 'https://edtool.ru/img/og-image.png';

    include $_SERVER['DOCUMENT_ROOT'] . '/_ui5_version.php';

    echo '
    <title>' . $title . '</title>
    <meta name="description" content="' . $description . '"> 
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta charset="UTF-8">
    <link rel="shortcut icon" href="favicon.png" type="image/x-icon">
    <link rel="stylesheet" href="css/style.css" type="text/css" media="all" />

    <meta name="twitter:card" content="summary_large_image"/>
    <meta property="twitter:image" content="' . $og_image . '"/>
    <meta name="twitter:title" content="' . $title . '"/>
    <meta name="twitter:description" content="' . $description . '"/>
    <meta property="og:image" content="' . $og_image . '"/>
    <meta property="og:title" content="' . $title . '"/>
    <meta property="og:description" content="' . $description . '"/>

    <script 
        src="' . $ui5_url . '/resources/sap-ui-cachebuster/sap-ui-core.js" 
        id="sap-ui-bootstrap" 
        data-sap-ui-libs="sap.m" 
        data-sap-ui-theme="sap_fiori_3" 
        data-sap-ui-bindingSyntax="complex" 
        data-sap-ui-preload="async" 
        data-sap-ui-appCacheBuster = "./"
        data-sap-ui-resourceroots=\'{
            "eh": "./",
            "eh.modules": "./modules",
            "eh.lib": "./lib"
        }\'></script>';

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