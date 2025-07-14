sap.ui.define(['sap/fe/test/TemplatePage'], function(TemplatePage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new TemplatePage(
        'gwm.coremytask::xGWMxCE_TASKSMain',
        CustomPageDefinitions
    );
});