sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'com.ndbs.fi.zwftogovernbp',
            componentId: 'WFBPGovRecordsList',
            contextPath: '/WFBPGovRecords'
        },
        CustomPageDefinitions
    );
});