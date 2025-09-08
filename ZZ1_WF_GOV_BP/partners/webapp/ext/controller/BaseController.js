sap.ui.define(
    ['sap/m/MessageBox'
    ], function (MessageBox) {
        "use strict";
        let i18nModel;
        return {


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
            handleWizardCancel: function (thiz) {
                thiz.oCreateBPDialog.close();
            },

            handleWizardSubmit: function (thiz) {
                const createBP = thiz.base.getView().getModel("createBP").getData();
                const oOperation = this._prepareOperationBinding(createBP, thiz);
                this._setClientHeaderParameters(oOperation, createBP);
                oOperation.execute().then(
                    () => this._onOperationSuccess(thiz),
                    (error) => this._onOperationError(error, thiz)
                );
            },

            _setClientHeaderParameters: function (oOperation, createBP) {
              const  dateTimeRequestedValue = new Date().toISOString();  
                const params = [
                    { key: "BusinessPartner", value: createBP.BusinessPartner },
                    { key: "ReferenceBusinessPartner", value: createBP.ReferenceBusinessPartner },
                    { key: "CompanyCode", value: createBP.CompanyCode },
                    { key: "SalesOrganization", value: createBP.SalesOrganization },
                    { key: "DistributionChannel", value: createBP.DistributionChannel },
                    { key: "Division", value: createBP.Division },
                    { key: "CustomerFirstName", value: createBP.CustomerFirstName },
                    { key: "CustomerLastName", value: createBP.CustomerLastName },
                    { key: "Street1", value: createBP.Street1 },
                    { key: "Street2", value: createBP.Street2 },
                    { key: "City", value: createBP.City },
                    { key: "PostCode", value: createBP.PostCode },
                    { key: "Country", value: createBP.Country },
                    { key: "Email", value: createBP.Email },
                    { key: "EmailFinance", value: createBP.EmailFinance },
                    { key: "TelNumber1", value: createBP.TelNumber1 },
                    { key: "TelNumber2", value: createBP.TelNumber2 },
                    { key: "VatRegistration", value: createBP.VatRegistration },
                    { key: "CompanyRegistration", value: createBP.CompanyRegistration },
                    { key: "Currency", value: createBP.Currency },
                    { key: "ContractValue", value: createBP.ContractValue },
                    { key:"AccountAssignment", value: createBP.AccountAssignment },
                    { key: "Department", value: createBP.Department },
                    { key: "RequestedBy", value: createBP.RequestedBy },
                    { key: "AuthoriserSelected", value: createBP.AuthoriserSelected },
                    { key: "DateTimeRequested", value: dateTimeRequestedValue },
                ];

                params.forEach(param => {
                    oOperation.setParameter(param.key, param.value || "");
                });


            },




            _prepareOperationBinding: function (clientHeader, thiz) {
                const oModel = thiz.base.getExtensionAPI().getModel();
                return oModel.bindContext(`/WFBPGovRecords/com.sap.gateway.srvd.zui_wfbpgovrecords_m.v0001.MaintainBusinessPartner(...)`);
            },
            _onOperationSuccess: function (thiz) {
                const view = thiz.base.getView();
                view.getModel("clientHeader").setData({});
                view.getModel("contactsTable").setData([]);
                view.getModel("TaxTable").setData([]);
                view.getModel("AddressTable").setData([]);

                //    sap.ui.getCore().byId("BusinessPartnerWizard").setCurrentStep("Details");
                thiz.oDialog.getContent()[0].getContent().setCurrentStep("Details");
                thiz.oDialog.close();
            },
            _onOperationError: function (oError, thiz) {
                let errorMessage = "Error";
                try {
                    if (oError && oError.message) {
                        errorMessage = oError.message;
                    } else if (oError.responseText) {
                        const errorObj = JSON.parse(oError.responseText);
                        errorMessage =
                            errorObj?.error?.message?.value ||
                            errorObj?.error?.message ||
                            errorObj?.message ||
                            errorMessage;
                    } else if (typeof oError === "string") {
                        errorMessage = oError;
                    }
                } catch (err) {
                    errorMessage = "Error";
                }
                MessageBox.error(errorMessage);
            },


        }
    })





