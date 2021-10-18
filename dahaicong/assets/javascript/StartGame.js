cc.Class({
    extends: cc.Component,
     onLoad () {
        cc.director.preloadScene("level", function () {
          
        });
     },
   loadScene(){
       cc.director.loadScene("level"); 
   },
});
