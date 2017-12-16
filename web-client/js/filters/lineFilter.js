'use strict';

/**
 * Filter - lineFilter
 */
termonWebClient.filter('lineFilter', function() {

    return function(terrariumList) {
        let splittedTerrariumList = [];

        let i, j, temparray, chunk = 2;
        for (i = 0, j = terrariumList.length; i < j; i += chunk) {
            temparray = terrariumList.slice(i, i + chunk);
            splittedTerrariumList.push(temparray)
        }

        return splittedTerrariumList;
    }
    
});
