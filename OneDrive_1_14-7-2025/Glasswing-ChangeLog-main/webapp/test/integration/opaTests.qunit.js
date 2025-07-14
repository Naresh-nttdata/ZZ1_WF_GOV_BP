sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'gwm/changelog/test/integration/FirstJourney',
		'gwm/changelog/test/integration/pages/xGWMxC_REQCHGLOGMain'
    ],
    function(JourneyRunner, opaJourney, xGWMxC_REQCHGLOGMain) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('gwm/changelog') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThexGWMxC_REQCHGLOGMain: xGWMxC_REQCHGLOGMain
                }
            },
            opaJourney.run
        );
    }
);