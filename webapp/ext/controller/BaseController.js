sap.ui.define(
    ['sap/m/MessageBox',
        'com/ndbs/fi/zwftogovernbp/ext/util/Constants',
        'com/ndbs/fi/zwftogovernbp/ext/util/LogicHelper',

    ], function (MessageBox, Constants, LogicHelper) {
        "use strict";
        return {
            // ────────────────────────── OPEN FRAGMENT ──────────────────────────
            openFragment: async function (thiz, aComboBoxIds, FragmentId, exists, DialogExistsName, id) {
                if (!exists) {
                    exists ??= await thiz.base.getExtensionAPI().loadFragment({
                        name: FragmentId,
                        id: id,
                        controller: thiz,
                        type: "XML"
                    });
                    thiz[DialogExistsName] = exists;
                }
                return exists.open();
            },
            // ────────────────────────── ACTIONS ──────────────────────────
            Cancel: function (thiz, iconTabBarId, modelName, closeDialog) {
                this.resetIconTabBar(iconTabBarId);
                closeDialog.close();
                this.clearModel(thiz, modelName);
            },
            clearModel: function (thiz, modelName) {
                thiz.getView().getModel(modelName).setData({});
            },
            resetIconTabBar: function (iconTabBarId) {
                const oIconTabBar = sap.ui.getCore().byId(iconTabBarId);
                if (oIconTabBar) {
                    oIconTabBar.setSelectedKey(Constants.Header);
                }
            },
            Submit: async function (thiz) {
                try {
                    const isValid = this._checkMandatoryfields(thiz);
                    if (!isValid) {
                        return;
                    }
                    const createBP = this._getCreateBPData(thiz);
                    const oOperation = this._prepareOperationBinding(createBP, thiz);
                    this._setClientHeaderParameters(oOperation, createBP);
                    const oModel = thiz.base.getExtensionAPI().getModel();
                    this._handlePostSubmit(thiz, response);
                } catch (error) {
                    this._handleError(error);
                }
            },

            _checkMandatoryfields: function (thiz) {
                const BPData = thiz.base.getView().getModel(Constants.createBP).getData();

                // Always mandatory fields
                const baseMandatoryFields = [
                    { key: Constants.BusinessPartnerTypeKey, label: Constants.BusinessPartnerTypeLabel },
                    { key: Constants.BusinessPartnerCategoryKey, label: Constants.BusinessPartnerCategoryBusinessPartnerCategoryLabel }
                ];

                // Conditional mandatory fields based on BusinessPartnerCategory
                if (BPData.BusinessPartnerCategory === Constants.one) {
                    baseMandatoryFields.push(
                        { key: Constants.CustomerFirstNameKey, label: Constants.CustomerFirstNameLabel },
                        { key: Constants.CustomerFirstNameKey, label: Constants.CustomerLastNameLabel }
                    );
                } else if (BPData.BusinessPartnerCategory === Constants.two) {
                    baseMandatoryFields.push(
                        { key: Constants.OrganizationNameKey, label: Constants.OrganizationNameLabel }
                    );
                }
                const missingFields = baseMandatoryFields.filter(field => {
                    const value = BPData[field.key];
                    return value === undefined || value === null || value.toString().trim() === "";
                });
                if (missingFields.length > 0) {
                    const messages = missingFields.map(field => `${field.label} is mandatory`);
                    MessageBox.error(messages.join("\n"));
                    return false;
                }
                return true;
            },
            _getCreateBPData: function (thiz) {
                return thiz.base.getView().getModel(Constants.createBP).getData();
            },
            _handlePostSubmit: function (thiz, response) {
                const view = thiz.base.getView();
                view.getModel(Constants.createBP).setData({});

                if (thiz.oCreateBPDialog) {
                    thiz.oCreateBPDialog.close();
                    this._handleResponse(response, "ListReport", thiz);
                } if (thiz.oUpdateBPDialog) {
                    thiz.oUpdateBPDialog.close();
                    this._handleResponse(response, "ObjectPage", thiz);
                }
            },

            _handleResponse: function (response, page, thiz) {
                const bpData = response?.getBoundContext()?.getObject();
                const i18nModel = thiz.base.getView().getModel("i18n").getResourceBundle();
                if (page == "ListReport") {
                    const TemporaryBusinesPartner = bpData?.TemporaryBusinesPartner;
                    if (TemporaryBusinesPartner) {
                        MessageBox.success(i18nModel.getText("bpCreationSuccess", [TemporaryBusinesPartner]));
                    } else {
                        MessageBox.error("Error");
                    }
                }
                else {
                    const BusinesPartner = bpData?.BusinessPartner;
                    if (BusinesPartner) {
                        MessageBox.success(i18nModel.getText("bpUpdateSuccess", [BusinesPartner]));
                    } else {
                        MessageBox.error("Error");
                    }
                }
            },

            _handleError: function (error) {
                console.error("Submit error:", error);
                MessageBox.error("An unexpected error occurred");
            },


            _setClientHeaderParameters: function (oOperation, createBP) {
                this._setDateTimeRequestedParameter(oOperation, createBP.DateTimeRequested);
                const params = this._buildClientHeaderParams(createBP);
                params.forEach(param => {
                    oOperation.setParameter(param.key, param.value || "");
                });
            },
            _setDateTimeRequestedParameter: function (oOperation, dateTimeRequested) {
                if (dateTimeRequested) {
                    let [datePart, timePart] = dateTimeRequested.split(', ');
                    let [day, month, year] = datePart.split('.').map(Number);
                    let [hours, minutes, seconds] = timePart.split(':').map(Number);
                    let date = new Date(year, month - 1, day, hours, minutes, seconds);
                    oOperation.setParameter("DateTimeRequested", date);
                }
            },
            onTabSelect: function (event, thiz, page) {
                const i18nModel = thiz.getView().getModel("i18n").getResourceBundle();
                const selectedTab = event.getParameter('previousKey');
                const createBP = thiz.getView().getModel(Constants.createBP).getData();
                const validationRules = {
                    'Header': [
                        { check: () => !createBP.BusinessPartnerCategory, messageKey: "BPCategoryMandatory" },
                        { check: () => !createBP.BusinessPartnerType, messageKey: "BPTypeMandatory" }],
                    'Address': [
                        { check: () => createBP.isCustomerFirstNameEnabled && !createBP.CustomerFirstName, messageKey: "CustomerFirstNameMandatory" },
                        { check: () => createBP.isCustomerLastNameEnabled && !createBP.CustomerLastName, messageKey: "CustomerLastNameMandatory" },
                        { check: () => createBP.isNameEnabled && !createBP.OrganizationName, messageKey: "NameMandatory" }
                    ]
                };
                const rules = validationRules[selectedTab] || [];
                const errorMessages = [];
                rules.forEach(rule => {
                    if (rule.check()) {
                        errorMessages.push(i18nModel.getText(rule.messageKey));
                    }
                });
                if (errorMessages.length > 0) {
                    const errorMsg = errorMessages.join("\n");
                    if (page == "ListReport") {
                        sap.ui.core.Fragment.byId("CreateBPListReport", "idIconTabBarNoIcons").setSelectedKey(selectedTab);
                    }
                    if (page == "ObjectPage") {
                        sap.ui.core.Fragment.byId("CreateBPObjectPage", "idIconTabBarNoIcons").setSelectedKey(selectedTab);
                    }
                    MessageBox.error(errorMsg);
                    return;
                }
            },
            _buildClientHeaderParams: function (createBP) {
                return [
                    { key: "BusinessPartner", value: createBP.BusinessPartner },
                    { key: "TemporaryBusinesPartner", value: createBP.TemporaryBusinesPartner },
                    { key: "BusinessPartnerCategory", value: createBP.BusinessPartnerCategory },
                    { key: "ReferenceBusinessPartner", value: createBP.ReferrenceBusinessPartner },
                    { key: "CompanyCode", value: createBP.CompanyCode },
                    { key: "SalesOrganization", value: createBP.SalesOrganization },
                    { key: "DistributionChannel", value: createBP.DistributionChannel },
                    { key: "Division", value: createBP.Division },
                    { key: "CustomerFirstName", value: createBP.CustomerFirstName },
                    { key: "CustomerLastName", value: createBP.CustomerLastName },
                    { key: "OrganizationName", value: createBP.OrganizationName },
                    { key: "FinanceContact", value: createBP.FinanceContact },
                    { key: "Street1", value: createBP.Street1 },
                    { key: "Street2", value: createBP.Street2 },
                    { key: "City", value: createBP.City },
                    { key: "PostCode", value: createBP.PostCode },
                    { key: "Country", value: createBP.Country },
                    { key: "Email", value: createBP.Email },
                    { key: "EmailFinance", value: createBP.EmailFinance },
                    { key: "TelephoneNumber", value: createBP.TelephoneNumber },
                    { key: "CellphoneNumber", value: createBP.CellphoneNumber },
                    { key: "VatRegistration", value: createBP.VatRegistration },
                    { key: "CompanyRegistration", value: createBP.CompanyRegistration },
                    { key: "Currency", value: createBP.Currency },
                    { key: "ContractValue", value: createBP.ContractValue },
                    { key: "AccountAssignment", value: createBP.AccountAssignment },
                    { key: "Department", value: createBP.Department },
                    { key: "RequestedBy", value: createBP.RequestedBy },
                    { key: "AuthoriserSelected", value: createBP.AuthoriserSelected },
                    { key: "BusinessPartnerType", value: createBP.BusinessPartnerType },
                    { key: "BusinessPartnerGrouping", value: createBP.BusinessPartnerGrouping },
                    { key: "CustomerAccountGroup", value: createBP.CustomerAccountGroup },
                    { key: "SalesOffice", value: createBP.SalesOffice },
                ];
            },
            _prepareOperationBinding: function (clientHeader, thiz) {
                const oModel = thiz.base.getExtensionAPI().getModel();
                return oModel.bindContext(`/WFBPGovRecords/com.sap.gateway.srvd.zui_wfbpgovrecords_m.v0001.MaintainBusinessPartner(...)`);
            },
            onBPCategorySelect: function (event, value, thiz) {
                let bpcategoryvalue;
                if (event) {
                    bpcategoryvalue = event.getParameter('newValue');
                }
                else {
                    bpcategoryvalue = value;
                }
                let createBPModel = thiz.getView().getModel(Constants.createBP).getData();
                if (bpcategoryvalue == "Person" || bpcategoryvalue == "1") {
                    createBPModel['isCustomerFirstNameEnabled'] = true;
                    createBPModel['isCustomerLastNameEnabled'] = true;
                    createBPModel['isNameEnabled'] = false;
                }
                else {
                    createBPModel['isCustomerFirstNameEnabled'] = false;
                    createBPModel['isCustomerLastNameEnabled'] = false;
                    createBPModel['isNameEnabled'] = true;
                }
                thiz.getView().getModel(Constants.createBP).setData(createBPModel);
                thiz.getView().getModel(Constants.createBP).refresh();
            }
          
        }
    })