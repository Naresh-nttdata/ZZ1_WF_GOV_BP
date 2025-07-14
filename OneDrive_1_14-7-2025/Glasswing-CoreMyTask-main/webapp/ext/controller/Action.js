sap.ui.define([

    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/core/library",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (MessageBox, MessageToast, Fragment, coreLibrary,Filter, FilterOperator) {
        "use strict";
    return {  
        onMessagePopoverPress : async function(oBinding,oEvent){
            const that = this;
            const sButtonID = 'fe::FooterBar::CustomAction::messagepopover';
            const sFullyQualifiedButtonID = this.editFlow.getView().createId(sButtonID);
            const oButton = sap.ui.getCore().byId(sFullyQualifiedButtonID);
            if(this._messagepopover === undefined){
                const oMessagePopover = await this.loadFragment({name:'gwm.product.ext.view.MessagePopover'});
                this._messagepopover = oMessagePopover;                    
                this._messagepopoverInit = true;
            }
            this._messagepopover.openBy(oButton);

            this._messagepopover.attachBrowserEvent('focusout',(oEvent)=>{
                const sMessagePopover = oEvent.target.id;
                const oMessagePopover = sap.ui.getCore().byId(sMessagePopover);
                if(oMessagePopover !== undefined && oMessagePopover.close !== undefined && that._messagepopoverInit === false){
                    oMessagePopover.close();
                    oMessagePopover.detachBrowserEvent('focusout');
                    return;
                }
                that._messagepopoverInit = false;
            });
            
        },        
        navToApp:async function(oEvent){
            try {
                const oBtn = oEvent.getSource();
                const oBindingContext = oBtn.getBindingContext();
                //const oData2 = await oBindingContext.requestObject();
                const oTable = oBtn.getParent().getParent().getParent();
                const oModel = oTable.getModel();
                const oContext = oModel.bindContext(oBindingContext.getPath(), oBindingContext, {$select: "Requestid,Objectnumber,Objecttype,Processstep,Core"});
                const oData = await oContext.requestObject();
                const sObjectnumber = oData.Objectnumber;
                const sProcessstep = oData.Processstep;
                const sObjecttype = oData.Objecttype;
                const sRequestid = oData.Requestid.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/,"$1-$2-$3-$4-$5").toLowerCase(); 
                const sCoreId = oData.Core;
                let sSemanticObject = "GLASSWING";
                let sAction;

                switch(true) {
                    case sObjecttype === 'PRODUCT' && (sProcessstep === 'I' || sProcessstep === 'C' || sProcessstep === 'E') :
                        sap.ui.getCore().getModel('flpLocalModel').setProperty('/FromCoreMyTask', true);
                        sAction = "productApp&/xgwmxc_core_obj_product(Core=" + sCoreId + ",IsActiveEntity=true)";
                        sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
                            target : {semanticObject: sSemanticObject, action : sAction }
                        });
                        break;
                    case sObjecttype === 'BUSINESSPARTNER' && (sProcessstep === 'I' || sProcessstep === 'C' || sProcessstep === 'E') : 
                        sAction = "bpApp&/xGWMxC_CORE_OBJ_BP(Core=" + sCoreId + ",IsActiveEntity=true)";
                        sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
                            target : {semanticObject: sSemanticObject, action : sAction }
                        });
                        break;
                    case sProcessstep === 'A' || sProcessstep === 'AS' :          
                        sAction = "coreMyApproval";
                        sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
                            target : {semanticObject: sSemanticObject, action : sAction },
                            params : { "Objectnumber" : sObjectnumber, "Requestid" : sRequestid }
                        });
                        break;
                }
                // const sService = 'com.sap.gateway.srvd.gwm.sd_core_obj_product.v0001';
                // const action =  `${sService}.send_request`;
                // const parameters = {
                //     contexts:oBindingContext,
                //     model:oBindingContext.getModel(),
                // };
                
                // const oResult = await this.editFlow.invokeAction(action,parameters);
                // const oData = oResult.getObject();
                // this.extension.gwm.product.ext.controller.Extension.handleMessages(oData);
                
                // sap.ui.core.BusyIndicator.hide();
                // this.routing.navigateToRoute('');                
            } catch (error) {
                sap.ui.core.BusyIndicator.hide();
            }
        },     
    };

});