// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

export namespace EX
{
    export  function    ListRemove( array, item)
    {
        var length = array.length;
        for(var i = 0; i < length; i++)
        {
            if(array[i]==item)
            {
                if(i == 0)
                {
                    array.shift(); //删除并返回数组的第一个元素
                    return;
                }
                else if(i == length-1)
                {
                    array.pop();  //删除并返回数组的最后一个元素
                    return;
                }
                else
                {
                    array.splice(i,1); //删除下标为i的元素
                    return;
                }
            }
        }
    }

    export function PrefixInteger(num, length) 
    {
        return ( "0000000000000000" + num ).substr( -length );
    }
}
 




