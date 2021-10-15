using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MapCreator : MonoBehaviour
{

    public GameObject[] items;//0老家 1墙 2障碍 3Born 4River 5Grass 6AirBarrier

    private List<Vector3> itemPositionList=new List<Vector3>();//已有位置


    // Start is called before the first frame update
    void Start()
    {
        InitMap();
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    void  InitMap()
    { 
        //heart
        CreateItem(items[0],new Vector3(0,-8,0),Quaternion.identity);
        //heart's wall
        CreateItem(items[1],new Vector3(-1,-8,0),Quaternion.identity);
        CreateItem(items[1],new Vector3(1,-8,0),Quaternion.identity);
        CreateItem(items[1],new Vector3(-1,-7,0),Quaternion.identity);
        CreateItem(items[1],new Vector3(0,-7,0),Quaternion.identity);
        CreateItem(items[1],new Vector3(1,-7,0),Quaternion.identity);


        //airBarrier,9与11
        for(int i=-9;i<10;i++)
        {
            CreateItem(items[6],new Vector3(-11,-i,0),Quaternion.identity);
            CreateItem(items[6],new Vector3(11,i,0),Quaternion.identity);
        }    
        for(int i=-10;i<11;i++)
        {
            CreateItem(items[6],new Vector3(-i,9,0),Quaternion.identity);
            CreateItem(items[6],new Vector3(i,-9,0),Quaternion.identity);
        }    
        //wall
        for(int i=0;i<40;i++)
        {
            CreateItem(items[1],CreateRandomPosition(),Quaternion.identity);
        }   
        //barrier
        for(int i=0;i<20;i++)
        {
            CreateItem(items[2],CreateRandomPosition(),Quaternion.identity);
        }   
        //river
        for(int i=0;i<20;i++)
        {
            CreateItem(items[4],CreateRandomPosition(),Quaternion.identity);
        }   
        //grass
        for(int i=0;i<20;i++)
        {
            CreateItem(items[5],CreateRandomPosition(),Quaternion.identity);
        }   
    }

    void CreateItem(GameObject createGameObject,Vector3 createPosition,Quaternion createRotation)
    {
        GameObject item=Instantiate(createGameObject,createPosition,createRotation);
        item.transform.SetParent(gameObject.transform);
        itemPositionList.Add(createPosition);
    }
    Vector3 CreateRandomPosition()//产生随机位置
    { 
        while(true)
        { 
            //去除外环，防止死路
            Vector3 createPosition=new Vector3(Random.Range(-9,10),Random.Range(-7,8));
        
            if(!HasThePosition(createPosition))//位置不重复
            { 
                return createPosition;
            }        
        }
    }
    bool HasThePosition(Vector3 pos)//位置去重
    {
        for(int i=0;i<itemPositionList.Count;i++)
        {
            if(itemPositionList[i]==pos)
            {
                return true;
            }
        }
        return false;
    }
}
