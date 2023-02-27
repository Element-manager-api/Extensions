var initalizeConsoleAddin = (function () {
    function initalizeConsoleAddin() {
    }
    initalizeConsoleAddin.prototype.initialize = function () {
        var id = "reportApp";
        var label = "Report App";
        var isDisable = false;
        ORACLE_SERVICE_CLOUD.extension_loader.load("ConsoleApp").then(function (extensionProvider) {
            extensionProvider.registerUserInterfaceExtension(function (userInterfaceExtension) {
                userInterfaceExtension.getLeftSidePaneContext().then(function (leftSidePaneContext) {
                    leftSidePaneContext.getSidePane(id).then(function (leftPanelContext) {
                        var icon = leftPanelContext.createIcon('font awesome');
                        icon.setIconClass("fa fa-line-chart");
                        icon.setIconColor("blue");
                        leftPanelContext.addIcon(icon);
                        leftPanelContext.setContentUrl("../pages/reportApp.html");
                        leftPanelContext.setLabel(label);
                        leftPanelContext.setDisabled(isDisable);
                        leftPanelContext.render();
                    });
                });
            });
        });
    };
    return initalizeConsoleAddin;
}());

