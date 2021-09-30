sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
    "use strict";
    return Controller.extend("recovery.app", {

        onInit: function () {
            this._oData = {
                email: '',
                token: '',
                password: ''
            };
            this._oModel = new JSONModel(this._oData);

            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this._oRouter.getRoute("email").attachPatternMatched(this._onRouteEmail, this);
            this._oRouter.getRoute("password").attachPatternMatched(this._onRoutePassword, this);

            this.getView().setModel(this._oModel);
        },

        _onRouteEmail: function () {
            this.byId('app').to(this.byId('pageEmail'));
        },

        _onRoutePassword: function (oEvent) {
            this._oData.token = oEvent.getParameter('arguments').token;
            this.byId('app').to(this.byId('pagePassword'));
        },

        /**
         * Отправить запрос на сброс пароля
         */
        reset: function () {
            let out = {
                passwordReset: 1
            };
            out.email = this._oData.email;
            let that = this;
            this.byId('app').setBusy(true);
            $.post({
                url: window.location.origin + '/backend/services/passwordRecovery.php',
                data: out
            }).done(function (answer) {
                if (answer.trim() === 'OK') {
                    MessageBox.success(
                        'Если пользователь с таким email существует, мы отправим ссылку для сброса пароля', {
                        title: ''
                    });
                } else {
                    that.showError();
                }
            }).fail(function () {
                that.showError();
            }).always(function (answer) {
                for (let prop in that._oData) {
                    that._oData[prop] = '';
                }
                that._oModel.refresh();
                that.byId('app').setBusy(false);
            });
        },

        /**
         * Установить новый пароль
         */
        set: function () {

            let that = this;
            this.byId('app').setBusy(true);
            $.post({
                url: window.location.origin + '/backend/services/passwordRecovery.php',
                data: {
                    passwordNew: null,
                    token: that._oData.token,
                    password: that._oData.password
                }
            }).done(function (answer) {
                answer = answer.trim();
                if (answer === 'OK') {
                    MessageBox.success('Пароль изменен. Теперь вы сможете войти', {
                        title: '',
                        onClose: function(){
                            sap.m.URLHelper.redirect("../", false);
                        }
                    });
                } else if (answer === 'NO_TOKEN') {
                    MessageBox.error('Ссылка недействительна или просрочена.\nПерейдите на главную страницу снова запросите сброс пароля.', {
                        title: '',
                        onClose: function(){
                            sap.m.URLHelper.redirect("../", false);
                        }
                    });
                } else {
                    that.showError();
                }
            }).fail(function () {
                that.showError();
            }).always(function () {
                for (let prop in that._oData) {
                    that._oData[prop] = '';
                }
                that._oModel.refresh();
                that.byId('app').setBusy(false);
            });

        },

        showError: function () {
            MessageBox.error("Произошла непредвиденная ошибка", {
                title: "Ошибка",
            });
        },

        gotoRoot: function () {
            window.open('/', '_self');
        }
    });
});
