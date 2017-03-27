/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-undef: 0*/
//To use a javascript controller its name must end with .controller.js
sap.ui.controller("controller.App", {
	onInit: function() {
		var model = new sap.ui.model.json.JSONModel({});
		this.getView().setModel(model);
	},

	callCarService: function() {
		var oModel = sap.ui.getCore().getModel("carModel");
		var result = this.getView().getModel().getData();
		var oEntry = {};
		oEntry.CARID = "00000000";
		oEntry.CUSTID = result.CustId;
		oEntry.MODEL = result.Model;
		oEntry.DESCR = result.Descr;
		oEntry.VIN = result.Vin;
		oEntry.LICPLATE = result.LicPlate;

		oModel.setHeaders({
			"content-type": "application/json;charset=utf-8"
		});
		var mParams = {};
		mParams.success = function() {
			sap.m.MessageToast.show("Create successful");
		};
		mParams.error = this.onErrorCall;
		oModel.create("/Car", oEntry, mParams);
	},

	callDeleteSelected: function() {
		var oTable = this.getView().byId("TableCar");
		var oModel = sap.ui.getCore().getModel("carModel");

		if (oTable !== null) {
			for (var path in oTable.getSelectedContextPaths()) {
				oModel.remove(oTable.getSelectedContextPaths()[path], {
					success: function(oData, oResponse) {
						sap.m.MessageToast.show("Deleted successfully");
						oModel.refresh(true);
					},
					error: function(oError) {
						sap.m.MessageToast.show("Failure during delete");
						oModel.refresh(true);
					}
				});
			}
			oTable.removeSelections();
		}
	},

	callCarUpdate: function() {
		var oModel = sap.ui.getCore().getModel("carModel");
		oModel.setHeaders({
			"content-type": "application/json;charset=utf-8"
		});

		var oEntry = {};
		var oTable = sap.ui.getCore().byId("TableCar");

		for (var property in oModel.mChangedEntities) {
			oEntry = oModel.oData[property];

			for (var changedField in oModel.mChangedEntities[property]) {
				if (changedField.toString() !== "__metadata") {
					oEntry[changedField] = oModel.mChangedEntities[property][changedField];
				}
			}
			delete oEntry.__metadata;
			delete oEntry.CarService;
			delete oEntry.CarCustomer;

			oModel.update("/" + property.toString(), oEntry, {
				success: function(oData, oResponse) {
					sap.m.MessageToast.show("updated Successfully");

				},
				error: function(oError) {
					sap.m.MessageToast.show("failure");
				}
			});
		}

		//var mParams = {};
		//mParams.error = function() {
		//	sap.m.MessageToast.show("Update failed");
		//};
		//mParams.success = function() {
		//	sap.m.MessageToast.show("Update successful");
		//};
		//
		//oModel.submitChanges(mParams);
	}
});