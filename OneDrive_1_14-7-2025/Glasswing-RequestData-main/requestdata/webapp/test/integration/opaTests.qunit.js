sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'glasswing/requestdata/test/integration/FirstJourney',
		'glasswing/requestdata/test/integration/pages/xGWMxC_REQUEST_DATAMain'
    ],
    function(JourneyRunner, opaJourney, xGWMxC_REQUEST_DATAMain) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('glasswing/requestdata') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThexGWMxC_REQUEST_DATAMain: xGWMxC_REQUEST_DATAMain
                }
            },
            opaJourney.run
        );
    }
);