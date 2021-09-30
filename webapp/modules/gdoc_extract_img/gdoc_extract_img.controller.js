sap.ui.define([
    "eh/modules/base/baseController",
    'sap/m/MessageToast'
], function (Controller, MessageToast) {
    "use strict";
    return Controller.extend("eh.modules.gdoc_extract_img.gdoc_extract_img", {

        helpDialogShow: function () {
            if (!this._oHelpDialog) {
                this._oHelpDialog = sap.ui.xmlfragment("eh.modules.gdoc_extract_img.helpDialog", this);
            }
            this.getView().addDependent(this._oHelpDialog);
            this._oHelpDialog.open();
        },

        helpDialogClose: function () {
            this._oHelpDialog.close();
        },

        pressGDocExtract: function () {
            this.busyIndicatorShow();
            let sUrl = this.getView().byId("inputGDocUrl").getValue();
            let docID;

            sUrl.split('/').forEach(function (item, index, array) {
                if (item === 'd') { // находим в url /d/ и после него идет айдишник документа
                    docID = array[index + 1];
                }
            });

            let that = this;
            $.post({
                url: window.location.origin + '/backend/services/gdoc_extract_images.php',
                data: {
                    documentId: docID
                },
                xhrFields: {
                    responseType: 'blob'
                },
            }).done(function (resp) {
                const url = URL.createObjectURL(resp);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'images.zip';
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(resp);
            }).fail(function (answer) {
                switch (answer.status) {
                    case 401:
                        window.location.reload();
                        break;
                    case 402:
                        that.showNeedPay();
                        break;
                    case 404:
                        MessageToast.show('Гугл-док не найден.\nВы точно ввели правильную ссылку?');
                        break;
                    case 406:
                        MessageToast.show('Нет доступа.\nВы открыли доступ к гугл-доку?');
                        break;
                    case 415:
                        MessageToast.show('В документе нет изображений');
                        break;
                    default:
                        MessageToast.show('Непредвиденная ошибка.\nПопробуйте еще раз');
                }
            }).always(function (dd) {
                that.busyIndicatorHide();
            });
        }
    });
});
