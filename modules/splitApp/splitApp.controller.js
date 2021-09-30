/**
 * Это — SplitApp, который является корневым элементом как для десктопной версии, так и для мобильной.
 * 
 * Но фишка в том, что SplitApp в мобильной версии не отображает master-страницу и иконку главного меню, чтобы показать этот master
 * Вот один из пруфов: https://github.com/SAP/openui5/issues/30 Это не баг, а фича.
 * 
 * Я пробовал разные решения, в итоге пришел к тому, что
 * 1. В каждой detail-странице в header-е есть кнопка, которая отображается только в мобильной версии
 * 2. При нажатии на эту кнопку показывается фрагмент с альтернативным меню (что-то вроде поповера)
 * 
 */
sap.ui.define([
    "eh/modules/base/baseController",
    "sap/ui/model/json/JSONModel",
    'eh/modules/base/base'
], function (Controller, JSONModel, base) {
    "use strict";

    const _mainMenuModel = new JSONModel();

    return Controller.extend("eh.modules.splitApp.splitApp", {

        onInit: function () {
            const isPhone = base.getComponent().getModel('device').getData().isPhone;

            _mainMenuModel.loadData('modules/splitApp/mainMenu.json', null, false);
            this.getView().setModel(_mainMenuModel, 'mainMenu');

            // для десктопа удаляем нижние пункты меню, потому что они будут в поповере. А для мобилки все в одном месте
            if (!isPhone) {
                _mainMenuModel.setData(_mainMenuModel.getData().filter(item => {
                    if (item.type === 'bottom') return false;
                    else return true;
                }));
            }
        },

        onNavTo: function (oEvent) {
            base.getRouter().navTo(
                oEvent.getParameter('item').getBindingContext('mainMenu').getObject().key
            );
        },

        onSettingsButtonPress: function () {
            let that = this;
            sap.ui.require(['eh/modules/splitApp/desktop/popover'], function (popover) {
                popover.showPopover({
                    oSource: that.byId("buttonSettings")
                });
            });
        }
    });
});
