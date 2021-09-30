sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'eh/lib/lib',
    'sap/ui/core/BusyIndicator',
], function (Controller, JSONModel, lib, BusyIndicator) {
    "use strict";
    return Controller.extend("eh.modules.index.index", {

        onInit: function () {
            var oModel = new JSONModel({
                HTML1: "<strong>Пригодится для верстки и публикации</strong>. Чтобы сверстать статью из документа, из него нужно извлечь все изображения. Часто для этого используют Google Keep или скачивают документ как архив. Но эти способы не всегда удобны.\
                <ul>\
                <li>Google Keep удобен, только когда в документе 3-5 изображений. А если их хотя бы 10 штук, это становится рутиной.</li>\
                <li>Если скачать документ как архив, то изображения будут пронумерованы <em>по времени их вставки в документ</em>, а не в том порядке, как они <em>расположены в документе</em>. То есть когда вы добавляете, удаляете или перемещаете изображения в документе — нумерация сбивается.</li>\
                </ul>\
                <strong>edTool скачает и пронумерует изображения за вас</strong>. Скопируйте ссылку на Гугл-док, вставьте ее в сервис и получите архив с правильно пронумерованными изображениями."
            });
            this.getView().setModel(oModel);
        },

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

        gotoPasswordRecovery: function () {
            window.open('/password_recovery', '_self');
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
                url: window.location.origin + "/backend/services/login.php",
                data: {
                    password: password,
                    email: email
                }
            }).done(function (data) {
                let text = '';
                switch (data.trim()) {
                    case 'need_reload':
                        window.location.reload();
                        break;
                    case 'need_validate':
                        text = 'Вы зарегистрировались.\r\nТеперь нужно подтвердить адрес — проверьте почту.\r\nЕсли письмо не приходит — проверьте папку «Спам»';
                        BusyIndicator.hide();
                        break;

                }
                oTextMessage.removeStyleClass('ehColorRed').addStyleClass('ehColorGreen');
                oTextMessage.setText(text);
            }).fail(function (error) {
                let text = '';
                switch (error.responseText) {
                    case 'wrong_password':
                        text = 'Неправильный пароль';
                        break;
                    case 'user_unvalidated':
                        text = 'Вы не еще подтвердили e-mail адрес.\r\nПроверьте почту.\r\nЕсли письмо не приходит — проверьте папку «Спам»';
                        break;
                    case 'WEAK_PASSWORD':
                        text = 'Пароль не может быть короче 5 символов.';
                        break;
                    default:
                        text = 'Произошла непредвиденная ошибка.\r\nПопробуйте еще раз.'
                        break;

                }
                oTextMessage.removeStyleClass('ehColorGreen').addStyleClass('ehColorRed');
                oTextMessage.setText(text);
                BusyIndicator.hide();
            })
        },

    });
});
