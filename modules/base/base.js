
/**
 * Не контроллер!
 * Какие-то базовые функции, которые могут использоваться как в контроллерах, так и в других местах
 */
sap.ui.define([], function() {
    "use strict";

    const _oComponent = sap.ui.getCore().getComponent('component'),
        _oEventBus = sap.ui.getCore().getEventBus();

    return {

        getComponent: function() {
            return _oComponent;
        },

        getEventBus: function() {
            return _oEventBus;
        },

        getRouter: function() {
            return _oComponent.getRouter();
        },

        getRootView: function() {
            return _oComponent.byId('splitAppView');
        },

        getSplitApp: function() {
            return this.getRootView().byId('splitApp');
        },

        getMainMenu: function() {
            return this.getRootView().byId('listMainMenu');
        }
    };
});
