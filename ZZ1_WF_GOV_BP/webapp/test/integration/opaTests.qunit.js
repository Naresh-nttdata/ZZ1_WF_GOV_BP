sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/ndbs/fi/zwftogovernbp/test/integration/FirstJourney',
		'com/ndbs/fi/zwftogovernbp/test/integration/pages/WFBPGovRecordsList',
		'com/ndbs/fi/zwftogovernbp/test/integration/pages/WFBPGovRecordsObjectPage'
    ],
    function(JourneyRunner, opaJourney, WFBPGovRecordsList, WFBPGovRecordsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/ndbs/fi/zwftogovernbp') + '/index.html'
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