sap.ui.define([
    "eh/modules/base/baseController",
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'eh/lib/lib'
], function (Controller, MessageToast, MessageBox, lib) {
    "use strict";

    function _showSuccess(sText) {
        MessageToast.show(sText);
    }

    function _showError(sText) {
        MessageBox.error(sText);
    }

    return Controller.extend("eh.modules.settings.settings", {

        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("settings").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            let selectedTab = 'tabUser';
            if (oEvent.getParameter("arguments").type === 'pay') {
                selectedTab = 'tabPay';
            }
            this.byId('iconTabBar').setSelectedKey(selectedTab);
        },

        onChangePasswordPress: function () {
            this.busyIndicatorShow();
            $.post({
                url: window.location.origin + '/backend/services/change_password.php',
                data: {
                    old_password: this.byId("inputOldPassword").getValue(),
                    new_password: this.byId("inputNewPassword").getValue()
                }
            }).done(function () {
                _showSuccess('Пароль изменен');
            }).fail(function (answer) {
                if (answer.status === 401) {
                    window.location.reload();
                } else {
                    switch (answer.responseText) {
                        case 'OLD_PASSWORD_INCORRECT':
                            _showError('Старый пароль неправильный, проверьте еще раз');
                            break;
                        case 'WEAK_PASSWORD':
                            _showError('Новый пароль не может быть короче 5 символов.');
                            break;
                        default:
                            _showError('Непредвиденная ошибка.\nПопробуйте позже');
                            break;
                    }
                }
            }).always(function () {
                this.byId("inputOldPassword").setValue();
                this.byId("inputNewPassword").setValue();
                this.busyIndicatorHide();
            }.bind(this));
        },

        resetValueState: function (oEvent) {
            oEvent.getSource().setValueState();
        },

        pay: function () {
            this.busyIndicatorShow();
            $.post({
                url: window.location.origin + '/backend/services/pay.php',
                data: {
                    GENERATE_LINK_FOR_PAY: 1
                }
            }).done(function (lnk) {
                if (lib.isValidUrl(lnk)) {
                    sap.m.URLHelper.redirect(lnk, false);
                } else {
                    _showError('Непредвиденная ошибка.\nПопробуйте позже');
                }
            }).fail(function (answer) {
                if (answer.status === 401) {
                    window.location.reload();
                } else {
                    _showError('Непредвиденная ошибка.\nПопробуйте позже');
                }
            }).always(function () {
                this.busyIndicatorHide();
            }.bind(this));

        }
    });
});
