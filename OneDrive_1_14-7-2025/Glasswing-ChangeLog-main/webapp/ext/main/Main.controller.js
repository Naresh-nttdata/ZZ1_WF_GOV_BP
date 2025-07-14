sap.ui.define(
    [
        'sap/fe/core/PageController'
    ],
    function(PageController) {
        'use strict';

        return PageController.extend('gwm.changelog.ext.main.Main', {
            onRowPress:function(oEvent){
                const oBindingContext = oEvent.getParameter('bindingContext');
                const sPath = oBindingContext.getPath();
                const sKeys = sPath.split('(').pop().split(')').shift();
                const oRouter = this.getAppComponent().getRouter();
                oRouter.navTo('xGWMxC_REQCHGLOGObjectPage',{xGWMxC_REQCHGLOGKey:sKeys});
            },
            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf gwm.objecttype.ext.main.Main
             */
            onInit: function () {
                PageController.prototype.onInit.apply(this, arguments);
                const that = this;
                const sFullyQualifiedID = this.getView().createId('changeLogFilterBar');
                const oFilterBar = this.byId(sFullyQualifiedID);
                oFilterBar.triggerSearch();

                this.getAppComponent().getRouter().getRoute('xGWMxC_REQCHGLOGMain').attachPatternMatched((oEvent)=>{
                    const sFullyQualifiedTableID = that.getView().createId('changeLogTable');
                    const oTable = that.byId(sFullyQualifiedTableID);
                    oTable.refresh();
                    that.getAppComponent().getModel('ui').setProperty('/isEditable',false);
                },this);                
             },

            /**
             * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
             * (NOT before the first rendering! onInit() is used for that one!).
             * @memberOf gwm.changelog.ext.main.Main
             */
            //  onBeforeRendering: function() {
            //
            //  },

            /**
             * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
             * This hook is the same one that SAPUI5 controls get after being rendered.
             * @memberOf gwm.changelog.ext.main.Main
             */
            //  onAfterRendering: function() {
            //
            //  },

            /**
             * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
             * @memberOf gwm.changelog.ext.main.Main
             */
            //  onExit: function() {
            //
            //  }
        });
    }
);
