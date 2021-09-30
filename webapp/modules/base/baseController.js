/**
 * Базовый контроллер, который может содержать в себе различные полезные функции для многих других контроллеров
 */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/core/BusyIndicator',
    'eh/modules/base/base',
    'sap/m/MessageBox'
], function (Controller, BusyIndicator, base, MessageBox) {
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
        },

        showNeedPay: function () {
            MessageBox.error("У вас закончилась подписка, нужно оплатить", {
                title: '',
                actions: [MessageBox.Action.OK],
                onClose: function () {
                    base.getRouter().navTo('settings', {
                        type: 'pay'
                    });
                }
            });
        }
    });
});
