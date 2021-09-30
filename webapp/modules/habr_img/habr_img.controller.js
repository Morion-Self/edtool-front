sap.ui.define([
    "eh/modules/base/baseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'eh/lib/lib'
], function (Controller, JSONModel, Filter, FilterOperator, lib, editDialog, deleteDialog) {
    "use strict";
    return Controller.extend("eh.modules.habr_img.habr_img", {

        doReplace: function () {

            // Собираем изображения из хабра-стораджа
            let sHabrastorage = this.getView().byId("inputHabrastorage").getValue();
            let aHabrastorageImages = sHabrastorage.split('\n').filter(i => i); // чтобы разбить строку, но при этом убрать пустые массивы. Потому что пользователь может вставить несколько \n как рзаделитель, и нужно чтобы работало всегда



            // Собираем картинки, которые нужно заменить
            let sHabrText = this.getView().byId("inputHabrText").getValue();
            var el = document.createElement('html');
            el.innerHTML = sHabrText;

            let aGoolgeImages = Array.from(el.getElementsByTagName('img')).filter(item => {
                return item.src.indexOf('googleusercontent.com') > -1;
            });

            if (aHabrastorageImages.lenght !== aGoolgeImages.length) {
                
            }

            let arr2 = {};
            Array.from(el.getElementsByTagName('a')).filter(item => {
                arr[item.href];
            });

        }
    });
});
