sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/partners/test/integration/FirstJourney',
		'com/partners/test/integration/pages/WFBPGovRecordsList',
		'com/partners/test/integration/pages/WFBPGovRecordsObjectPage'
    ],
    function(JourneyRunner, opaJourney, WFBPGovRecordsList, WFBPGovRecordsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/partners') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheWFBPGovRecordsList: WFBPGovRecordsList,
					onTheWFBPGovRecordsObjectPage: WFBPGovRecordsObjectPage
                }
            },
            opaJourney.run
        );
    }
);