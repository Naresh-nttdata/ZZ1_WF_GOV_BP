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

	return ControllerExtension.extend('com.ndbs.fi.zwftogovernbp.ext.controller.ListReportExt', {
		override: {
			// ────────────────────────── LIFECYCLE HOOKS ──────────────────────────
			onInit() {
				this._initializeModels([
					{
						modelName: Constants.createBP,
						data: {
							isReferenceBusinessPartnerEnabled: true,
							DialogTitle: Constants.NewCustomerRequest
						}
					},
				]);
			},
		},
		// ────────────────────────── MODELS INITIALIZE ──────────────────────────
		_initializeModels(models) {
			models.forEach(({ modelName, data, name, Defaultvalue }) => {
				const oModel = new JSONModel(data);
				this.base.getView().setModel(oModel, modelName);
				if (name && Defaultvalue !== undefined) {
					oModel.setProperty(name, Defaultvalue);
				}
			});
		},
		// ────────────────────────── New Customer Request ──────────────────────────
		CreateBusinessPartner: function () {
			BaseController.openFragment(this, [], Constants.CreateBusinessPartnerButton, this.oCreateBPDialog, "oCreateBPDialog", "CreateBPListReport");
			BaseController.resetIconTabBar("CreateBPListReport--idIconTabBarNoIcons");
			let createBP = this.base.getView().getModel(Constants.createBP).getData();
			createBP.DialogTitle = Constants.NewCustomerRequest;
			this.base.getView().getModel(Constants.createBP).setData(createBP);
		},
		onTabSelect: function (event) {
			BaseController.onTabSelect(event, this, "ListReport");
		},
		_fetchBusinessPartnerData: function (sBp, SalesOrganization, CompanyCode, DistributionChannel, Division) {
			this.SalesOrganization = SalesOrganization;
			this.CompanyCode = CompanyCode;
			this.DistributionChannel = DistributionChannel;
			this.Division = Division;
			sBp = this._padBusinessPartnerId(sBp);
			const oFilter = this._createBusinessPartnerFilter(sBp);
			this._fetchFilteredBusinessPartners(oFilter)
				.then(filteredData => {
					this._processBusinessPartnerData(filteredData);
				});
		},
		_padBusinessPartnerId: function (sBp) {
			return sBp.padStart(10, "0");
		},
		_createBusinessPartnerFilter: function (sBp) {
			return new sap.ui.model.Filter({
				path: "BusinessPartner",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: sBp
			});
		},
		_fetchFilteredBusinessPartners: function (oFilter) {
			const oModel = this.getView().getModel();
			const oListBinding = oModel.bindList("/ExistingBusinessPartner", undefined, undefined, [oFilter]);
			return oListBinding.requestContexts().then(aContexts => {
				const data = aContexts.map(context => context.getObject());
				return this._filterBusinessPartnersByParams(data);
			});
		},
		_filterBusinessPartnersByParams: function (data) {
			return data.filter(item => {
				return (
					(!this.SalesOrganization || item.SalesOrganization === this.SalesOrganization) &&
					(!this.CompanyCode || item.CompanyCode === this.CompanyCode) &&
					(!this.DistributionChannel || item.DistributionChannel === this.DistributionChannel) &&
					(!this.Division || item.Division === this.Division)
				);
			});
		},
		_processBusinessPartnerData: function (filteredData) {
			filteredData.forEach(item => {
				item.ReferrenceBusinessPartner = item.BusinessPartner;
				item.BusinessPartner = "";
				item.CustomerFirstName = "";
				item.CustomerLastName = "";
			});
			const selectedData = filteredData[0] || {};
			const createBPModel = this.getView().getModel(Constants.createBP);
			selectedData.DialogTitle = Constants.NewCustomerRequest;
			createBPModel.setData(selectedData);
			createBPModel.refresh();
			BaseController.onBPCategorySelect(undefined, selectedData.BusinessPartnerCategory || null, this);
		},
		onBPCategorySelect: function (event) {
			BaseController.onBPCategorySelect(event, undefined, this);
		},
		// ────────────────────────── SUGGESTIONS FOR REFERENCE BUSINESS PARTNER ──────────────────────────
		onSelectedSuggestion: function (event) {
			const Selectedrecord = event.getParameter('selectedRow').getBindingContext().getObject();
			this._fetchBusinessPartnerData(Selectedrecord.BusinessPartner, Selectedrecord.SalesOrganization, Selectedrecord.CompanyCode, Selectedrecord.DistributionChannel, Selectedrecord.Division)
		},
		onSuggest: function (oEvent) {
			var sTerm = oEvent.getParameter("suggestValue");
			var aFilters = [];
			if (sTerm) {
				aFilters.push(new Filter("BusinessPartner", FilterOperator.StartsWith, sTerm));
			}
			oEvent.getSource().getBinding("suggestionRows").filter(aFilters);
		},
		// ────────────────────────── ACTIONS FOR NEW CUSTOMER REQUEST ──────────────────────────
		Submit: function () {
			BaseController.Submit(this);
		},
		Cancel: function () {
			BaseController.Cancel(this, "CreateBPListReport--idIconTabBarNoIcons", Constants.createBP, this.oCreateBPDialog);
		}
	});
});
