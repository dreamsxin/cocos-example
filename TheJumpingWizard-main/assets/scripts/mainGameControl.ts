
import { _decorator, Component, Node, director, physics, v2 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = MainGameControl
 * DateTime = Sat Oct 02 2021 20:24:48 GMT+0200 (hora de verano de Europa central)
 * Author = jsgarcia
 * FileBasename = mainGameControl.ts
 * FileBasenameNoExtension = mainGameControl
 * URL = db://assets/scripts/mainGameControl.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('MainGameControl')
export class MainGameControl extends Component {
    

    start () {
       
    }

    onLoad () {
        let physics_manager = director.getPhysicsManager();
        physics_manager.enable = true;
        physics_manager.gravity = v2 (0, -2000);
    }

   
}



export function getPhysicsManager() {
    throw new Error('Function not implemented.');
}

