sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'gwm/coreapproval/test/integration/FirstJourney',
		'gwm/coreapproval/test/integration/pages/xGWMxC_CORE_OBJ_APPROVALMain'
    ],
    function(JourneyRunner, opaJourney, xGWMxC_CORE_OBJ_APPROVALMain) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('gwm/coreapproval') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThexGWMxC_CORE_OBJ_APPROVALMain: xGWMxC_CORE_OBJ_APPROVALMain
                }
            },
            opaJourney.run
        );
    }
);