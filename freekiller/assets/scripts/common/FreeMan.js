
class FreeMan
{
    curLevel = 0;

    start()
    {
        cc.director.loadScene("main/FreeScene");
    }

    gotoNext()
    {
        ++this.curLevel;
        start();
    }
}

window.freeMan = new FreeMan();
