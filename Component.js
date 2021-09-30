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
            // device
            this.setModel(new JSONModel({
                isPhone: sap.ui.Device.system.phone
            }), "device");

            UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().initialize();


            // this.reloadUserModel();
        },

        /**
         * Перегружает модель user
         * @return {[type]} [description]
         */
        // reloadUserModel: function () {
        //     let out = $.Deferred();
        //     let that = this;
        //     $.get({
        //         url: 'backend/web/services/user.php',
        //     }).done(function (answer) {
        //         answer = JSON.parse(answer);
        //         // активен ли премиум
        //         answer.premiumInfo.enabled = (new Date(answer.premiumInfo.until * 1000) > new Date());
        //         that.setModel(new JSONModel(answer), 'user');
        //         out.resolve(answer);
        //     });
        //     return out.promise();
        // }
    });
});