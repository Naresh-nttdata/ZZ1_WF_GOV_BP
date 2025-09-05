sap.ui.define(['sap/ui/core/mvc/ControllerExtension',
	'com/ndbs/fi/zwftogovernbp/ext/controller/BaseController',
	'com/ndbs/fi/zwftogovernbp/ext/util/Constants',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageBox',
	'sap/ui/core/Fragment',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
], function (ControllerExtension, BaseController, Constants, JSONModel, MessageBox, Fragment, Filter, FilterOperator) {
	'use strict';

	return ControllerExtension.extend('com.ndbs.fi.zwftogovernbp.ext.controller.ObjectPageExt', {
		override: {
			// ────────────────────────── Lifcecycle Hooks ──────────────────────────
			onInit() {
				this._initializeModels([
					{
						modelName: Constants.createBP,
						data: {
							isReferenceBusinessPartnerEnabled: false,
							DialogTitle: Constants.UpdateCustomerRequest
						}
					},
				]);
			},
			onPageReady: async function () {
				const oContext = this.base.getView().getBindingContext();
				if (oContext && oContext.requestObject) {
					try {
						const oData = await this._fetchObjectData(oContext);
						this._handleButtonState(oData);
					} catch (err) {
						this._handleError(err);
					}
				} else {
					this._handleMissingContext();
				}
			},
		},
		// ────────────────────────── Models Initialize ──────────────────────────
		_initializeModels(models) {
			models.forEach(({ modelName, data, name, Defaultvalue }) => {
				const oModel = new JSONModel(data);
				this.base.getView().setModel(oModel, modelName);

				if (name && Defaultvalue !== undefined) {
					oModel.setProperty(name, Defaultvalue);
				}
			});
		},
		// ────────────────────────── Change Customer Request ──────────────────────────
		Edit: async function () {
			sap.ui.core.BusyIndicator.show(0);
			let thiz = this;
			const selectedRecord = this.base.getView().getBindingContext().getObject();
			this._updateSelectedRecord(selectedRecord);
			BaseController.resetIconTabBar("CreateBPObjectPage--idIconTabBarNoIcons");
			BaseController.onBPCategorySelect(undefined, selectedRecord.BusinessPartnerCategory || null, this);
			const oModel = this.base.getExtensionAPI().getModel();
			let WfBpgovrecordsID = selectedRecord.WfBpgovrecordsID;
			let oContextBindingAddresses = oModel.bindContext(`/WFBPGovRecords(WfBpgovrecordsID=${WfBpgovrecordsID},IsActiveEntity=true)/_WFBPGovRecordItems`);
			oContextBindingAddresses.requestObject().then((data) => {
				let newArray = data.value.map(item => ({
					FileContent: item.FileContent,
					FileName: item.FileName,
					MimeType: item.MimeType,
					Updkz: "E"
				}));
				let CreateBp = thiz.base.getView().getModel(Constants.createBP).getData();
				thiz.base.getView().getModel(Constants.createBP).setData(CreateBp);
				sap.ui.core.BusyIndicator.hide();
				thiz._openUpdateBPDialog();

			}).catch((err) => {
				sap.ui.core.BusyIndicator.hide();
				console.error("Error:", err);
			});

		},
		_updateSelectedRecord: function (selectedRecord) {
			selectedRecord.isReferenceBusinessPartnerEnabled = false;
			selectedRecord.DateTimeRequested = "";
			selectedRecord.DialogTitle = Constants.UpdateCustomerRequest;
			this.base.getView().getModel(Constants.createBP).setData(selectedRecord);
			this.base.getView().getModel(Constants.createBP).refresh();
		},
		_openUpdateBPDialog: function () {
			BaseController.openFragment(this, [], Constants.CreateBusinessPartnerButton, this.oUpdateBPDialog, "oUpdateBPDialog", "CreateBPObjectPage");
		},

		onTabSelect: function (event) {
			BaseController.onTabSelect(event, this, "ObjectPage");
		},
		// ────────────────────────── Actions for Change Customer Request ──────────────────────────
		Submit: function () {
			BaseController.Submit(this);
		},
		Cancel: function () {
			BaseController.Cancel(this, "CreateBPObjectPage--idIconTabBarNoIcons", Constants.createBP, this.oUpdateBPDialog);
		},
		onBPCategorySelect: function (event) {
			BaseController.onBPCategorySelect(event, undefined, this);
		},
		_fetchObjectData: async function (oContext) {
			try {
				return await oContext.requestObject();
			} catch (err) {
				throw new Error("Failed to fetch data from requestObject: " + err);
			}
		},
		_handleButtonState: function (oData) {
			const oView = this.base.getView();
			let createBP = this.base.getView().getModel(Constants.createBP).getData();
			if (oData.WorkflowStatus === "10") {
				createBP.isEditEnabled = true;
			} else {
				createBP.isEditEnabled = false;
			}
			this.base.getView().getModel(Constants.createBP).setData(createBP);
		},
		_handleError: function (err) {
			console.error("Error:", err.message || err);
		},
		_handleMissingContext: function () {
			console.warn("Binding context or requestObject not available.");
		}
	});
});

