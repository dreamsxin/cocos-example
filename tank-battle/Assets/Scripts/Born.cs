using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Born : MonoBehaviour
{

    public GameObject playerPrefab;
    public GameObject[] enemyPrefabList;

    public bool createPlayer;
    // Start is called before the first frame update
    void Start()
    {
        Invoke("BornTank",1f);//延时调用
        Destroy(gameObject,1f);//延时销毁
    }

    // Update is called once per frame
    void Update()
    {
        
    }
    private void BornTank()
    { 
        if(createPlayer)//生成玩家
        { 
            Instantiate(playerPrefab,transform.position,Quaternion.identity);
        }
        else if(!createPlayer)//生成敌人
        {
            int index=Random.Range(0,enemyPrefabList.Length-1);
            Debug.Log(enemyPrefabList.Length);
            Instantiate(enemyPrefabList[index], transform.position, Quaternion.identity);
        }
        
    }
}
