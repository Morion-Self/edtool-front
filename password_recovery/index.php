<!DOCTYPE HTML>
<html>

<head>
    <title>Восстановление пароля</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta charset="UTF-8">

    <?php
    include $_SERVER['DOCUMENT_ROOT'] . '/_ui5_version.php';

    echo '
        <script
            src="' . $ui5_url . '/resources/sap-ui-core.js" 
            id="sap-ui-bootstrap"
            data-sap-ui-libs="sap.m"
            data-sap-ui-theme="sap_belize"
            data-sap-ui-bindingSyntax="complex"
            data-sap-ui-preload="async"
            data-sap-ui-resourceroots=\'{
                "recovery": "./"
            }\'></script>';
    ?>

    <script>
        sap.ui.getCore().attachInit(function() {
            new sap.ui.core.ComponentContainer({
                name: "recovery",
                settings: {
                    id: "component"
                }
            }).placeAt("content");
        });
    </script>


</head>

<body class="sapUiBody" role="application">
    <div id="content" />
</body>

</html>