var CreateReport = (function () {
    function CreateReport() {
    }
    CreateReport.prototype.initializeExtension = function () {
        CreateReport.RESULT = document.getElementById("result");
        CreateReport.ALT_RESULT = document.getElementById("resultAlt");
        CreateReport.FIELD_NAME = document.getElementById("fieldName");
        CreateReport.FIELD_ID = document.getElementById("fieldId");
        CreateReport.SCRIPT_AREA = document.getElementById("scriptArea");
        ORACLE_SERVICE_CLOUD.extension_loader.load("AttachmentApp").then(function (extensionProvider) {
            extensionProvider.registerAnalyticsExtension(function (analyticsContext) {
                CreateReport.globalAnalyticsContext = analyticsContext;
            });
        });
    };
    CreateReport.triggerAction = function () {
        var fieldName = CreateReport.FIELD_NAME.value;
        var fieldId = CreateReport.FIELD_ID.value;
        var extAction = document.getElementById("actionSelect").value;
        CreateReport.RESULT.value = "";
        CreateReport.ALT_RESULT.value = "";
        CreateReport.SCRIPT_AREA.value = "";
        switch (extAction) {
            case "createReport":
                CreateReport.globalAnalyticsContext.createReport(Number(fieldName)).then(function (report) {
                    CreateReport.RESULT.value = "Report created";
                    CreateReport.globalReport = report;
                }).catch(function (err) {
                    CreateReport.errorHandling(err);
                });
                break;
            case "getAllFilterDetails":
                var filters = CreateReport.globalReport.getReportFilters().getFilterList();
                if (filters) {
                    CreateReport.RESULT.value = "Filter count: " + filters.length;
                    CreateReport.SCRIPT_AREA.value = JSON.stringify(filters);
                }
                break;
            case "getFilterDetails":
                var filters = CreateReport.globalReport.getReportFilters().getFilterList();
                if (fieldName && Number(fieldName) < filters.length) {
                    CreateReport.RESULT.value = "Filter id: " + filters[fieldName].getFilterId();
                    CreateReport.ALT_RESULT.value = "Filter value: " + filters[fieldName].getValue();
                    CreateReport.SCRIPT_AREA.value = JSON.stringify(filters[fieldName]);
                }
                break;
            case "getRowsPerPage":
                var filterObj = CreateReport.globalReport.getReportFilters();
                var rpp = filterObj.getRowsPerPage();
                if (!rpp) {
                    rpp = "null/undefined";
                }
                CreateReport.RESULT.value = rpp;
                break;
            case "getPageNumber":
                var filterObj = CreateReport.globalReport.getReportFilters();
                var page = filterObj.getPageNumber();
                if (!page) {
                    page = "null/undefined";
                }
                CreateReport.RESULT.value = page;
                break;
            case "getWorkspaceContext":
                var wsContext = CreateReport.globalReport.getReportWorkspaceContext();
                if (wsContext) {
                    CreateReport.RESULT.value = "Workspace type: " + wsContext.getObjectType();
                    CreateReport.ALT_RESULT.value = "Workspace Id: " + wsContext.getObjectId();
                }
                break;
            case "setFilterValue":
                var filter = CreateReport.globalReport.getReportFilters().getFilterList()[Number(fieldName)];
                if (filter.getOperatorType() == "Range") {
                    var startVal = fieldId.split("|")[0];
                    var endVal = fieldId.split("|")[1];
                    if (filter.getDataType() == "DateTime" || filter.getDataType() == "Date") {
                        startVal = new Date(startVal);
                        endVal = new Date(endVal);
                    }
                    filter.setFilterStartValue(startVal);
                    filter.setFilterEndValue(endVal);
                }
                else {
                    filter.setValue(fieldId);
                }
                CreateReport.RESULT.value = "Value set for filter";
                break;
            case "setRowsPerPage":
                var filterObj = CreateReport.globalReport.getReportFilters();
                filterObj.setRowsPerPage(Number(fieldName));
                CreateReport.RESULT.value = "Value set for rows per page";
                break;
            case "setPageNumber":
                var filterObj = CreateReport.globalReport.getReportFilters();
                filterObj.setPageNumber(Number(fieldName));
                CreateReport.RESULT.value = "Value set for page number";
                break;
            case "executeReport":
                CreateReport.createDataHandlerForReport(fieldName);
                CreateReport.globalReport.executeReport();
                break;
            case "addListener":
                CreateReport.globalAnalyticsContext.addTableDataRequestListener(fieldName, CreateReport.dataRequestCallBack);
                CreateReport.RESULT.value = "Listener added";
        }
    };
    CreateReport.dataRequestCallBack = function (report) {
        CreateReport.globalReport = report;
        CreateReport.RESULT.value = "Report object received";
    };
    CreateReport.createDataHandlerForReport = function (reportId) {
        CreateReport.globalReport.setDataHandler(function (param) {
            CreateReport.RESULT.value = "Report executed";
        });
    };
    CreateReport.errorHandling = function (err) {
        CreateReport.RESULT.value = "Error: " + err.getDesc();
    };
    return CreateReport;
}());
