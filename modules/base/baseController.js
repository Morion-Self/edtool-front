/**
 * Базовый контроллер, который может содержать в себе различные полезные функции для многих других контроллеров
 */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/core/BusyIndicator',
    './base'
], function (Controller, BusyIndicator, base) {
    "use strict";

    return Controller.extend("eh.modules.base.baseController", {

        /**
         * Переход на мастер страницу.
         * Используется в мобильниках
         */
        showMenuOnPhone: function (oEvent) {
            sap.ui.require(['eh/modules/splitApp/mobile/mainMenu'], function (mainMenu) {
                mainMenu.show();
            });
        },

        busyIndicatorShow: function () {
            BusyIndicator.show(1);
        },

        busyIndicatorHide: function () {
            BusyIndicator.hide();
        }
    });
});
