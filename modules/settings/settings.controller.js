sap.ui.define([
    "eh/modules/base/baseController",
    "sap/ui/model/json/JSONModel",
    'eh/modules/base/base',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/Device',
    'eh/lib/lib'
], function(Controller, JSONModel, base, MessageToast, MessageBox, Device, lib) {
    "use strict";

    function _showSuccess(sText) {
        MessageToast.show(sText);
    }

    function _showError(sText) {
        MessageBox.error(sText);
    }

    return Controller.extend("eh.modules.settings.settings", {

        onInit: function() {
            // $.get(
            //     'backend/web/services/orders.php?getTypes'
            // ).done(function(answer) {
            //     let model = {
            //         types: JSON.parse(answer)
            //     };
            //     this.getView().setModel(new JSONModel(model), 'orders');
            // }.bind(this));

            // let sWidth = Device.system.desktop ? '50%' : '100%';
            // this.byId('vboxEmail').setWidth(sWidth);
            // this.byId('vboxPassword').setWidth(sWidth);
        },

        onChangePasswordPress: function() {
            $.ajax({
                url: 'backend/services/change_password.php',
                type: 'POST',
                data: {
                    old_password: this.byId("inputOldPassword").getValue(),
                    new_password:this.byId("inputNewPassword").getValue()
                }
            }).done(function() {
                _showSuccess(base.i18n().getProperty('passwordChanged'));
            }).fail(function(answer) {
                if (answer.status === 401) {
                    window.location.reload();
                } else {
                    _showError(answer.responseText);
                }
            }).always(function() {
                this.byId("inputOldPassword").setValue();
                this.byId("inputNewPassword").setValue();
            }.bind(this));
        },

        resetValueState: function(oEvent) {
            oEvent.getSource().setValueState();
        },
    });
});
