sap.ui.define(['sap/fe/test/TemplatePage'], function(TemplatePage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new TemplatePage(
        'gwm.requestdata::xGWMxC_REQUEST_DATAMain',
        CustomPageDefinitions
    );
});