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

            fetch('backend/services/gdoc_extract_images.php?documentId=' + docID)
                .then(resp => resp.blob())
                .then(blob => {
                    if (blob.type === 'application/octet-stream') {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                        // the filename you want
                        a.download = 'images.zip';
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                    } else {
                        MessageToast.show('Непредвиденная ошибка... Попробуйте еще раз');
                    }
                    this.busyIndicatorHide();
                })
                .catch(() => {
                    this.busyIndicatorHide();
                    MessageToast.show('Непредвиденная ошибка... Попробуйте еще раз');
                });
        }

    });
});
