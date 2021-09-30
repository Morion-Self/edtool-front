sap.ui.define([
    'eh/modules/base/base',
    'sap/ui/core/BusyIndicator',
    'sap/m/MessageBox'
], function (base, BusyIndicator, MessageBox) {
    "use strict";

    return {

        showPopover: function (options) {
            if (!this._oPopover) {
                this._oPopover = sap.ui.xmlfragment("eh.modules.splitApp.desktop.popover", this);
            }
            base.getRootView().addDependent(this._oPopover);
            this._oPopover.openBy(options.oSource);
        },

        showSettings: function () {
            base.getRouter().navTo('settings');
        },

        logout: function () {
            BusyIndicator.show(1);
            $.post(
                window.location.origin + "/backend/services/signOut.php"
            ).done(function () {
                window.location.reload();
            });            
        },

        showHelp: function () {
            if (!this._oHelpDialog) {
                this._oHelpDialog = sap.ui.xmlfragment("eh.modules.splitApp.helpDialog", this);
            }
            base.getRootView().addDependent(this._oPopover);
            this._oHelpDialog.open();
        },

        closeHelp: function () {
            this._oHelpDialog.close();
        }
    };
});
