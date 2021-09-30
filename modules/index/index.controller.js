sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'eh/lib/lib',
    'sap/ui/core/BusyIndicator',
], function (Controller, lib, BusyIndicator) {
    "use strict";
    return Controller.extend("eh.modules.index.index", {

        loginDialogClose: function (oEvent) {
            this._oLoginDialog.close();
        },

        showLoginDialog: function (oEvent) {
            if (!this._oLoginDialog) {
                this._oLoginDialog = sap.ui.xmlfragment("eh.modules.index.loginDialog", this);
            }
            this.getView().addDependent(this._oLoginDialog);
            this._oLoginDialog.open();
        },

        resetValueState: function (oEvent) {
            oEvent.getSource().setValueState();
        },

        /**
         * При нажатии на кнопку 
         */
        _onButtonLoginPress: function () {
            BusyIndicator.show(1);
            let oInputEmail = sap.ui.getCore().byId("inputEmail");
            let password = sap.ui.getCore().byId("inputPassword").getValue();
            let email = oInputEmail.getValue();
            let oTextMessage = sap.ui.getCore().byId("textMessage");

            if (!lib.validateEmail(email)) {
                oInputEmail.setValueState('Error');
                oInputEmail.setValueStateText('Неправильный e-mail');
                BusyIndicator.hide();
                return;
            }
            $.post({
                url: "/backend/services/login.php",
                data: {
                    password: password,
                    email: email
                }
            }).done(function (data) {
                switch (data.trim()) {
                    case 'need_reload':
                        window.location.reload();
                        break;
                    case 'need_validate':
                        oTextMessage.removeStyleClass('ehColorRed').addStyleClass('ehColorGreen');
                        oTextMessage.setText('Вы зарегистрировались.\r\nТеперь нужно подтвердить адрес — проверьте почту.');
                        BusyIndicator.hide();
                        break;
                }
            }).fail(function (error) {
                let text = '';
                switch (error.responseText) {
                    case 'wrong_password':
                        text = 'Неправильный пароль';
                        break;
                    case 'user_unvalidated':
                        text = 'Вы не еще подтвердили e-mail адрес.\r\nПроверьте почту.';
                        break;
                    case 'weak_password':
                        text = 'Пароль не может быть короче 5 символов.';
                        break;

                }
                oTextMessage.removeStyleClass('ehColorGreen').addStyleClass('ehColorRed');
                oTextMessage.setText(text);
                BusyIndicator.hide();
            })
        },

    });
});
