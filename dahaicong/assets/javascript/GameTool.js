var GameTool={
    setButtonClickEvents: function (component, menu, handler,jsName,customEventData,isScale) {
        var clickEventHandler=new cc.Component.EventHandler();
        clickEventHandler.target=component.node;
        clickEventHandler.component=jsName;
        clickEventHandler.handler=handler;
        clickEventHandler.customEventData = customEventData;
        let button = menu.addComponent(cc.Button);
        button.clickEvents.push(clickEventHandler);
        if(isScale == undefined || isScale) {
            button.transition = cc.Button.Transition.SCALE;
            button.duration = 0.1;
            button.zoomScale = 1.2;
        }
    }
}
module.exports=GameTool;
