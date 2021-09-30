sap.ui.define([
    "sap/ui/core/UIComponent",
    'sap/ui/model/json/JSONModel'
], function (UIComponent, JSONModel) {
    "use strict";
    return UIComponent.extend("eh.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {

            // device model
            this.setModel(new JSONModel({
                isPhone: sap.ui.Device.system.phone
            }), "device");

            // user model
            $.get({
                url: window.location.origin + '/backend/services/pay.php',
                data: {
                    GET_PREMIUM_UNTIL: 1
                },
                async: false // чтобы интерфейс не рисовался до тех пор, пока не получим данные
            }).done(function (resp) {
                let until = new Date(resp);
                this.setModel(new JSONModel({
                    isPremium: (new Date() < until),
                    premiumUntil: until,
                    premiumUntilFormatted: until.toLocaleDateString(),
                    canPay: (new Date(Date.now() + 12096e5) > until), // Может ли пользователь уже оплачивать новую подписку (за 2 недели до окончания)
                }), "user");
                // debugger;
            }.bind(this));

            // tmp getRegDate
            // $.get({
            //     url: window.location.origin + '/backend/services/tmp_getRegDate.php',
            //     async: false // чтобы интерфейс не рисовался до тех пор, пока не получим данные
            // }).done(function (resp) {
            //     this.setModel(new JSONModel({
            //         tmp_getRegDate: new Date(resp)
            //     }), "tmp_getRegDate");
            // }.bind(this));

            UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().initialize();
        },
    });
});