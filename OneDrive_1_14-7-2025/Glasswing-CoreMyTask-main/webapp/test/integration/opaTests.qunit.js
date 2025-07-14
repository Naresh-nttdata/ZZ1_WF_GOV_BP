sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'gwm/coremytask/test/integration/FirstJourney',
		'gwm/coremytask/test/integration/pages/xGWMxCE_TASKSMain'
    ],
    function(JourneyRunner, opaJourney, xGWMxCE_TASKSMain) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('gwm/coremytask') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThexGWMxCE_TASKSMain: xGWMxCE_TASKSMain
                }
            },
            opaJourney.run
        );
    }
);