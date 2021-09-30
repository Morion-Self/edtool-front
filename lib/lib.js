/**
 * Либа различных техниеских функций
 */

sap.ui.define([], function () {
    "use strict";

    return {
        /**
         * Возвращает полную копию объекта
         */
        cloneObject: function (oObject) {
            try {
                return JSON.parse(JSON.stringify(oObject));
            } catch (e) {
                console.error(e);
                return {};
            }
        },

        /**
         * Проверка, корректное ли это число
         */
        isNumeric: function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },

        /**
         * Первая буква в строке большая, остальные маленькие
         */
        toWordCase: function (sStr) {
            return sStr.toUpperCase().substring(0, 1) + sStr.toLowerCase().substring(1);
        },

        validateEmail: function (email) {

            if (email.length <= 3) return false;

            let re =
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        },

        isValidUrl: function (str) {
            var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
            return !!pattern.test(str);
        }

    };

});
