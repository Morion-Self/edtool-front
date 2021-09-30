sap.ui.define([
    'eh/modules/base/base',
    'sap/ui/core/BusyIndicator',
], function (base, BusyIndicator) {
    "use strict";

    return {

        show: function () {
            if (!this._menu) {
                this._menu = sap.ui.xmlfragment("eh.modules.splitApp.mobile.mainMenu", this);
                base.getRootView().addDependent(this._menu);
            }
            this._menu.openBy();
        },

        onNavTo: function (oEvent) {
            let key = oEvent.getParameter('item').getBindingContext('mainMenu').getObject().key;

            switch (key) {
                case 'logout':
                    BusyIndicator.show(1);
                    $.post(
                        window.location.origin + "/backend/services/signOut.php"
                    ).done(function () {
                        window.location.reload();
                    });
                    break;
                case 'help':
                    if (!this._oHelpDialog) {
                        this._oHelpDialog = sap.ui.xmlfragment("eh.modules.splitApp.helpDialog", this);
                    }
                    base.getRootView().addDependent(this._menu);
                    this._oHelpDialog.open();
                    break;
                default:
                    base.getRouter().navTo(
                        oEvent.getParameter('item').getBindingContext('mainMenu').getObject().key
                    );
            }
        },

        closeHelp: function () {
            this._oHelpDialog.close();
        }


    }
});