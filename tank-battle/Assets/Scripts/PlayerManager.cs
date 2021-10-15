using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
public class PlayerManager : MonoBehaviour
{

    public int lifeValue=1;
    public GameObject bornPrefab;
    public int playerScore=0;
    public bool isDead=false;//玩家没条命
    public bool isDefeat=false;//老家没了

    public TextMesh lifeValueText;
    public TextMesh playerScoreText;
    public GameObject gameOverUI;


    private static PlayerManager instance;
    public static PlayerManager Instance//单例模式
    {
        get 
        { 
           return instance;           
        }
        set
        {
            instance=value;
        }
    }
    void Awake()
    { 
        Instance=this;
    }

    void Recover()
    {
        if(lifeValue<=0)
        {
            //游戏失败
            isDefeat=true;
            Invoke("ReturnToStart",3);

        }
        else 
        {
            lifeValue--;//没了一条命
            GameObject go=Instantiate(bornPrefab,new Vector3(-3,-8,0),Quaternion.identity);//玩家复活
            go.GetComponent<Born>().createPlayer=true;
            isDead=false;
        }

    }
    void ReturnToStart()
    { 
        UnityEngine.SceneManagement.SceneManager.LoadScene(0);
    }
    void Update()
    {
        if(isDefeat)
        {                     
            gameOverUI.SetActive(true);
            isDefeat=true;
            Invoke("ReturnToStart",3);
            return;
        }
        if(isDead)
        { 
            Recover();
        }      

        lifeValueText.text=lifeValue.ToString();
        playerScoreText.text=playerScore.ToString();
    }
}
