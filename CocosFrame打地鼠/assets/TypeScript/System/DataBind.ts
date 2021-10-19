export namespace DB{
    export class Data{
        value:any = null;
        listeners = [];
        
        //以value为参数，触发监听该数据的所有监听器
        //saveMode : 安全模式，开启时，将会把所有监听器拷贝到临时数组，再依次触发，
        //            避免在其中某个监听器中Bind或UnBind改变listeners数组数量，导致数组串位。
        public Invoke(saveMode){
            let temp;
            let len = this.listeners.length;
            if(saveMode){
                temp = [];
                for(let i=0; i<len; i++){
                    temp.push(this.listeners[i]);
                }
            }else{
                temp = this.listeners;
            }
            for(let i=0; i<len; i++){
                temp[i](this.value);
            }
        }
    }

    let map:Map<string, Data> = new Map<string, Data>();
    //向指定key增加一个监听器
    export function Bind(key:string, listener:(any)=>void){
        let data = map.get(key);
        if(!data){
            data = new Data();
            map.set(key, data);
        }
        if(data.listeners.indexOf(listener) <= 0){
            data.listeners.push(listener);
        }
        listener(data.value);
    }
    //绑定服务端数据
    export function BindRemote(key:string, listener:(any)=>void){
        Bind(key, listener);
        // Server.Get(key, (data)=>{
        //     Set(key, data);
        // },()=>{
            
        // });
    }
    //取消绑定一个监听器
    export function UnBind(key:string, listener:(any)=>void){
        let data = map.get(key);
        if(data){
            let index = data.listeners.indexOf(listener);
            if(index <= 0){
                data.listeners.splice(index, 1);
            }
        }
    }
    //设置数据的值，如果数据改变，则触发监听该数据的所有监听器
    export function Set(key:string, value, saveMode:boolean = false){
        let data = map.get(key);
        if(!data){
            data = new Data();
            data.value = value;
            map.set(key, data);
        }else{
            if(value !== data.value){
                data.value = value;
                data.Invoke(saveMode);
            }
        }
    }
    export function Get(key:string){
        let data = map.get(key);
        if(data){
            return data.value;
        }else return null;
    }
    //触发监听该数据的所有监听器
    export function Invoke(key:string, saveMode:boolean = false){
        let data = map.get(key);
        if(data){
            data.Invoke(saveMode);
        }
    }
    export class DataBindComponent extends cc.Component{
        private map:Map<string, (any)=>void> = new Map<string, (any)=>void>();

        public Bind(key, listener:(any)=>void){
            this.map.set(key, listener);
            DB.Bind(key, listener);
        }
        onDestroy(){
            this.map.forEach((v, k)=>{
                DB.UnBind(k, v);
            });
        }
    }
}