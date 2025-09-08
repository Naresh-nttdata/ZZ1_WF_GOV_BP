sap.ui.define(['sap/ui/core/mvc/ControllerExtension',
	'com/partners/ext/controller/BaseController',
	'com/partners/ext/util/Constants',
	'sap/ui/model/json/JSONModel',
], function (ControllerExtension, BaseController, Constants, JSONModel) {
	'use strict';

	return ControllerExtension.extend('com.partners.ext.controller.ListReportExt', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf com.partners.ext.controller.ListReportExt
			 */
			onInit() {
				this._initializeModels([
					{ modelName: Constants.createBP, data: {} },
				]);
			},

		},
		CreateBusinessPartner: function () {
			BaseController.openFragment(this, [], Constants.CreateBusinessPartnerButton, this.oCreateBPDialog, "oCreateBPDialog", "CreateBPListReport");
		},

		_initializeModels(models) {
			models.forEach(({ modelName, data, name, Defaultvalue }) => {
				const oModel = new JSONModel(data);
				this.base.getView().setModel(oModel, modelName);
				if (name && Defaultvalue !== undefined) {
					oModel.setProperty(name, Defaultvalue);
				}
			});
		},


		handleWizardSubmit: function () {
			BaseController.handleWizardSubmit(this);
		},
		handleWizardCancel: function () {
			BaseController.handleWizardCancel(this);
		},

	});
});
