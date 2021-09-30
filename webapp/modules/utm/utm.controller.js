sap.ui.define([
    "eh/modules/base/baseController",
    "sap/ui/model/json/JSONModel",
    'sap/m/MessageToast',
    'eh/lib/lib'
], function (Controller, JSONModel, MessageToast, lib) {
    "use strict";

    let _oSetTemplate = {
        isUtmEnabled: true,
        utm_source: '',
        utm_medium: '',
        utm_campaign: '',
        // isShorterEnabled: true,
        shorter: 'Нет',
    };

    const _defaultModel = new JSONModel();

    return Controller.extend("eh.modules.utm.utm", {

        onInit: function () {
            let o = lib.cloneObject(_oSetTemplate);
            o.number = 1;
            _defaultModel.setData([o]);
            this.getView().setModel(_defaultModel); // default

            let shortersModel = new JSONModel();
            shortersModel.loadData('modules/utm/shorters.json', null, false);
            this.getView().setModel(shortersModel, 'shorters');
        },

        helpDialogShow: function () {
            if (!this._oHelpDialog) {
                this._oHelpDialog = sap.ui.xmlfragment("eh.modules.utm.helpDialog", this);
            }
            this.getView().addDependent(this._oHelpDialog);
            this._oHelpDialog.open();
        },

        helpDialogClose: function () {
            this._oHelpDialog.close();
        },

        resultDialogClose: function () {
            this._oResultDialog.close();
        },

        saveDialogClose: function () {
            this._oSaveDialog.close();
        },

        addBlock: function () {
            let o = lib.cloneObject(_oSetTemplate);
            o.number = _defaultModel.getData().length + 1;
            _defaultModel.getData().push(o);
            _defaultModel.refresh();
        },

        deleteBlock: function (oEvent) {
            _defaultModel.getData().splice(oEvent.oSource.getBindingContext().getObject().number - 1, 1);
            this.renumberBlocks();
        },

        // обновляет нумерацию блоков, например, если удалили блок из середины
        renumberBlocks: function () {
            _defaultModel.getData().forEach(function (item, index) {
                item.number = index + 1;
            });
            _defaultModel.refresh();
        },

        pressDo: function () {
            let check = this.check();
            if (this.check() === true) {
                this.busyIndicatorShow();
                let oData = _defaultModel.getData();
                let sUrl = this.getView().byId("inputUrl").getValue();

                let aDeffereds = [];

                oData.forEach(function (item) {
                    let dOut = $.Deferred();
                    aDeffereds.push(dOut);
                    let newUrl = sUrl;
                    if (item.isUtmEnabled) {
                        // нужна проверка на заполнение обязательных меток
                        newUrl += '?utm_source=' + item.utm_source + '&utm_medium=' + item.utm_medium + '&utm_campaign=' + item.utm_campaign;
                        if (item.utm_content) {
                            newUrl += '&utm_content=' + item.utm_content;
                        }
                        if (item.utm_term) {
                            newUrl += '&utm_term=' + item.utm_term;
                        }
                    }
                    if (item.shorter != 'Нет') {
                        $.post({
                            url: window.location.origin + "/backend/services/utm.php",
                            data: {
                                mode: 'short',
                                url: newUrl,
                                shorter: item.shorter
                            }
                        }).done(function (answer) {
                            dOut.resolve({
                                name: 'Ссылка #' + item.number,
                                url: answer
                            });
                        });
                    } else {
                        dOut.resolve({ name: 'Ссылка #' + item.number, url: newUrl });
                    }
                });

                let that = this;

                $.when.apply($, aDeffereds).then(function (...args) {

                    let sText = '';
                    args.forEach(item => {
                        sText += '- ' + item.name + ': ' + item.url + '\n';
                    });

                    if (!that._oResultDialog) {
                        that._oResultDialog = sap.ui.xmlfragment("eh.modules.utm.resultDialog", that);
                    }
                    that._oResultDialog.setModel(new JSONModel({ result: sText, html: '<em>Ссылки скопированы в буфер обмена</em>' }));
                    that.getView().addDependent(that._oResultDialog);
                    that._oResultDialog.open();
                    navigator.clipboard.writeText(sText);
                    that.busyIndicatorHide();
                });
            } else {
                MessageToast.show(check);
            }
        },

        onUrlChange: function () {
            this.getView().byId("inputUrl").setValueState('None');
        },

        check: function () {
            let out = true;
            let oInput = this.getView().byId("inputUrl");
            if (!lib.isValidUrl(oInput.getValue())) {
                out = 'Неправильная ссылка';
                oInput.setValueState('Error');
            } else {
                oInput.setValueState('None');
            }

            return out;
        },

        showSaveDialog: function () {
            let that = this;
            that.busyIndicatorShow();
            if (!that._oSaveDialog) {
                that._oSaveDialog = sap.ui.xmlfragment("eh.modules.utm.saveDialog", that);
            }
            that._oSaveDialog.setModel(new JSONModel());
            that.getView().addDependent(that._oSaveDialog);
            this.loadConfigList().done(function () {
                that._oSaveDialog.open();
            });
        },

        // грузит список и обновляет модель
        loadConfigList: function () {
            let that = this;
            that.busyIndicatorShow();
            return $.post({
                url: window.location.origin + "/backend/services/utm.php",
                data: {
                    mode: 'loadList'
                }
            }).done(function (answer) {
                that._oSaveDialog.setModel(new JSONModel(JSON.parse(answer)), 'sets');
                that.busyIndicatorHide();
            }).fail(function (answer) {
                switch (answer.status) {
                    case 401:
                        window.location.reload();
                        break;
                    case 402:
                        that.showNeedPay();
                        break;
                    default:
                        MessageToast.show('Непредвиденная ошибка.\nПопробуйте еще раз');
                }
            }).always(function () {
                that.busyIndicatorHide();
            });
        },

        loadConfig: function (oEvent) {
            let that = this;
            that.busyIndicatorShow();
            let sName = oEvent.getSource().getBindingContext('sets').getObject();

            $.post({
                url: window.location.origin + "/backend/services/utm.php",
                data: {
                    mode: 'loadConfig',
                    configName: sName
                }
            }).done(function (answer) {
                _defaultModel.setData(JSON.parse(answer));
                _defaultModel.refresh();
                that.saveDialogClose();
                that.busyIndicatorHide();
            });
        },

        deleteConfig: function (oEvent) {
            let that = this;
            that.busyIndicatorShow();
            let sName = oEvent.getParameter('listItem').getBindingContext('sets').getObject();

            $.post({
                url: window.location.origin + "/backend/services/utm.php",
                data: {
                    mode: 'deleteConfig',
                    configName: sName
                }
            }).done(function () {
                that.loadConfigList().done(function () {
                    that.busyIndicatorHide();
                });
            });
        },

        saveConfig: function () {
            let that = this;
            this.busyIndicatorShow();
            $.post({
                url: window.location.origin + "/backend/services/utm.php",
                data: {
                    mode: 'saveConfig',
                    configName: that._oSaveDialog.getModel().getData().name,
                    config: JSON.stringify(_defaultModel.getData())
                }
            }).done(function () {
                that.saveDialogClose();
                that.busyIndicatorHide();
                MessageToast.show('Набор сохранен');
            });
        },


    });
});
