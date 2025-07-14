sap.ui.define(
    [
        'sap/fe/core/PageController',
        'sap/ui/model/json/JSONModel'
    ],
    function(PageController, JSONModel) {
        'use strict';

        return PageController.extend('gwm.coremytask.ext.main.Main', {
            onRowPress:function(oEvent){
                const oBindingContext = oEvent.getParameter('bindingContext');
                const sPath = oBindingContext.getPath();
                const sKeys = sPath.split('(').pop().split(')').shift();
                const oRouter = this.getAppComponent().getRouter();
                oRouter.navTo('xGWMxCE_TASKSObjectPage',{xGWMxCE_TASKSKey:sKeys});
            },
            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf gwm.field.ext.main.Main
             */
            onInit: function () {
                PageController.prototype.onInit.apply(this, arguments);
                const sFullyQualifiedID = this.getView().createId('coremytaskFilterBar');
                const oFilterBar = this.byId(sFullyQualifiedID);
                oFilterBar.triggerSearch();
                const that = this;

                if(sap.ui.getCore().getModel('flpLocalModel') === undefined) {
                    sap.ui.getCore().setModel(new JSONModel(), 'flpLocalModel');
                }

                this.getAppComponent().getRouter().getRoute('xGWMxCE_TASKSMain').attachPatternMatched((oEvent)=>{
                        const sFullyQualifiedTableID = that.getView().createId('coremytaskTable');
                        const oTable = that.byId(sFullyQualifiedTableID);
                        if(oTable.getMetadata().getName() === "sap.m.Table") {
                            oTable.refresh();
                        }                
                        that.getAppComponent().getModel('ui').setProperty('/isEditable',false);
                },this);                  
             },
             onRemoveRequest : function(oEvent){
                const i18nModel = this.getView().getModel('i18n').getResourceBundle();
                const headerText = i18nModel.getText('deleteRequestHeader');
                const itemText = i18nModel.getText('deleteRequestItem');
                const that = this;

                MessageBox.alert(itemText,{
                    icon: MessageBox.Icon.WARNING,
                    title: headerText,
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: (oEvent)=>{
                        if(oEvent === 'YES'){
                            that.deleteRequest();
                        }
                    }
                });
            },             
            deleteRequest:async function(oEvent){
                try {
                    sap.ui.core.BusyIndicator.show();
                    const sTableID = this.createId('coremytaskTable');
                    const oTable = this.byId(sTableID);
                    const aSelectedContexts = oTable.getSelectedContexts();

                    const oModel = this.getModel();
                    const that = this;
                    await Promise.all(aSelectedContexts.map((oContext)=>{
                        return new Promise((resolve,reject)=>{
                            if(that.editFlow.isDraftRoot(oContext) === true){
                                this.editFlow.cancelDocument(oContext,{skipDiscardPopover:true}).then(()=>{
                                    return resolve();
                                });
                            }else{
                                oModel.delete(oContext).then(()=>{
                                    resolve();
                                });
                            }
                        });
                    })); 
                    sap.ui.core.BusyIndicator.hide();
                    oTable.refresh();               
                } catch (error) {
                    sap.ui.core.BusyIndicator.hide();
                }
            },
            createRequest:function(oEvent){
                const oNewBinding = this.getModel().createBindingContext('/xGWMxCE_TASKS');
                this.editFlow.createDocument(oNewBinding.getPath(),{creationMode:'NewPage'});
            },   

            /**
             * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
             * (NOT before the first rendering! onInit() is used for that one!).
             * @memberOf gwm.coremytask.ext.main.Main
             */
            //  onBeforeRendering: function() {
            //
            //  },

            /**
             * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
             * This hook is the same one that SAPUI5 controls get after being rendered.
             * @memberOf gwm.coremytask.ext.main.Main
             */
            //  onAfterRendering: function() {
            //
            //  },

            /**
             * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
             * @memberOf gwm.coremytask.ext.main.Main
             */
            //  onExit: function() {
            //
            //  }
        });
    }
);
