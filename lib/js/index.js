var viewerApp;
var viewer;
var extension;
var _mainViewerSubToolbar = null;
var controlGroup;
var toolbar;
var options = {
    env: 'AutodeskProduction',
    getAccessToken: function (onGetAccessToken) {
        // TODO.. change your access_token here
        var accessToken = 'eyJhbGciOiJIUzI1NiIsImtpZCI6Imp3dF9zeW1tZXRyaWNfa2V5In0.eyJjbGllbnRfaWQiOiIyM1NxQkJWYnpQcm1sYmo1dzVlSzlVZUV0SXhzTDJuVSIsImV4cCI6MTQ5ODIwMTU3OCwic2NvcGUiOlsiZGF0YTpyZWFkIiwiZGF0YTp3cml0ZSIsImJ1Y2tldDpjcmVhdGUiLCJidWNrZXQ6cmVhZCJdLCJhdWQiOiJodHRwczovL2F1dG9kZXNrLmNvbS9hdWQvand0ZXhwNjAiLCJqdGkiOiJJZEpydVlRUExrazlBZTVWb3ExN2sxVkRvekhzMWhpMFFScVJJN1dlWEJaakJuZlhXSG0yNm04OWF6N2dQQWZEIn0.-fClotLiK3mHmFWDrd3p44_vVl2kONtAi99BAIh21Jc';
        var expireTimeSeconds = 86400;
        onGetAccessToken(accessToken, expireTimeSeconds);
    }
};
var URN = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dGVzdGFuZG9zdGVjYXp6b2RpYXBpLWFydGh1cjEyMy9TSEFfQV9BJUU2JUE1JUJDQ18xNTA3MjEucnZ0';
Autodesk.Viewing.Initializer(options, function onInitialized() {
    var config = {
        extensions: ["Autodesk.ADN.Viewing.Extension.Color","Viewing.Extension.StateManager"]
    };
    viewerApp = new Autodesk.Viewing.ViewingApplication('MyViewerDiv');
    viewerApp.registerViewer(viewerApp.k3D, Autodesk.Viewing.Private.GuiViewer3D, config);
    viewerApp.loadDocument(URN, onDocumentLoadSuccess, onDocumentLoadFailure);
});

function onDocumentLoadSuccess(doc) {
    var viewables = viewerApp.bubble.search({'type': 'geometry'});
    if (viewables.length === 0) {
        return;
    }
    viewerApp.selectItem(viewables[0].data, onItemLoadSuccess, onItemLoadFail);
}

function onDocumentLoadFailure(viewerErrorCode) {

}

function onItemLoadSuccess(viewer, item) {
    // extension = viewer.getExtension("Autodesk.Viewing.MarkupsCore");
    this.viewer = viewer;
    // 背景颜色
    viewer.setBackgroundColor(12, 42, 78, 12, 42, 78);
    setTimeout(function(){
        disableToolbarButtons();
        viewer.removeEventListener("selection");
    }, 100);
    // 加载AxisHelper -- line and point
    viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function () {
        viewer.loadExtension('Autodesk.ADN.Viewing.Extension.AxisHelper');
    });

    $("#state-manager-control-tooltip").html("模型视角");
}

function onItemLoadFail(viewer, item) {

}

// 隐藏按钮事件
function disableToolbarButtons() {
    var mainToolbar = viewer.getToolbar(false);
    toolbar = mainToolbar;
    // 设置某些按钮隐藏
    var _controlGroup_1 = mainToolbar.getControl("navTools");
    _controlGroup_1.removeControl("toolbar-cameraSubmenuTool");
    var _controlGroup_2 = mainToolbar.getControl("settingsTools");
    _controlGroup_2.removeControl("toolbar-propertiesTool");
    _controlGroup_2.removeControl("toolbar-settingsTool");
}

function drawPointBall (x, y, z, color) {
    x = x ? x : 0;
    y = y ? y : 0;
    z = z ? z : 0;
    // color为16进制数
    color = color ? color : 0xff0000;
    var ball = viewer.drawBallPoint(x, y, z, color);
    viewer.isolate(-1);
    return ball;
}

function cleanPointBall (ball) {
    viewer.clearBallPoint(ball);
    viewer.showAll();
}