sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'gwm/coremyapproval/test/integration/FirstJourney',
		'gwm/coremyapproval/test/integration/pages/xGWMxC_WFCTRL_AUTHMain'
    ],
    function(JourneyRunner, opaJourney, xGWMxC_WFCTRL_AUTHMain) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('gwm/coremyapproval') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThexGWMxC_WFCTRL_AUTHMain: xGWMxC_WFCTRL_AUTHMain
                }
            },
            opaJourney.run
        );
    }
);