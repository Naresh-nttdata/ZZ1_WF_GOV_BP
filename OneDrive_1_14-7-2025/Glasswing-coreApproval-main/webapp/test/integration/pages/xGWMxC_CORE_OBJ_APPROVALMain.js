sap.ui.define(['sap/fe/test/TemplatePage'], function(TemplatePage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new TemplatePage(
        'gwm.coreapproval::xGWMxC_CORE_OBJ_APPROVALMain',
        CustomPageDefinitions
    );
});