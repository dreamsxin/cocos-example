using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class FoodMaker 
    
    
    
    
    
    
    : MonoBehaviour
{

    public int xLimit = 12;//(1280-300)/stepLength/2
    public int yLimit = 9;//720/stepLength/2
    public int xOffset = 1;
    public int yOffset = 1;

    public int stepLength = 40;
    public GameObject foodPrefab;
    public Sprite[] foodSpriteArr;//food的图片数组
    private Transform foodHolder;//food的父节点



    void Start()
    {
        foodHolder = GameObject.Find("FoodHolder").transform;
        MakeFood();
    }
    public void MakeFood()
    {
        //实例
        GameObject food = Instantiate(foodPrefab);
        food.transform.SetParent(foodHolder, false);
        //图
        int index = Random.Range(0, foodSpriteArr.Length);
        food.GetComponent<Image>().sprite = foodSpriteArr[index];
        //位置
        int x = Random.Range(-xLimit+ xOffset, xLimit );
        int y = Random.Range(-yLimit+ yOffset, yLimit);
        food.transform.localPosition = new Vector3(x * stepLength, y * stepLength,0);     

    }
    void Update()
    {
        //MakeFood();
    }
    //***************************************************************************
    //通知生成新的food
    private static FoodMaker _instance;//静态类，通过类名访问

    public static FoodMaker Instance//获取
    {
        get
        {
            return _instance;
        }
    }

    void Awake()
    {
        _instance = this;//脚本初始化时赋为this
    }
    /// <summary>
    /// 16
    /// </summary>
    public GameObject rewardPrefab;

    public void MakeReward()
    {
        //实例
        GameObject reward = Instantiate(rewardPrefab);
        reward.transform.SetParent(foodHolder, false);

        //位置
        int x = Random.Range(-xLimit + xOffset, xLimit);
        int y = Random.Range(-yLimit + yOffset, yLimit);
        reward.transform.localPosition = new Vector3(x * stepLength, y * stepLength, 0);
    }
}
