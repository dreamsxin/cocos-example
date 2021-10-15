using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class MainUIControl : MonoBehaviour
{
    public int score = 0;
    public int foodScore = 5;
    public int rewardScore = 5;
    public int length = 0;
    public Text scoreText;
    public Text lengthText;
    public Text msgText;
    private Color tmpColor;
    public Image bg;
    //Image bg = GameObject.Find("Bg").GetComponent<Image>();//这种方法没拿到

    public Button pauseButton;
    public bool isPause = false;
    public Sprite[] pauseSpriteArr;

    public bool hasBorder=true;//默认有边界

    void Awake()
    {
        _instance = this;//脚本初始化时赋为this
    }
    void Start()
    {
        if (PlayerPrefs.GetInt("border", 1) == 0)//没边界
        {
            hasBorder = false;
            foreach (Transform t in bg.gameObject.transform)
            {
                t.gameObject.GetComponent<Image>().enabled = false;
            }
        }
    }

    public void UpdateUI(int scoreChange,int lengthChange)
    {
        score += scoreChange;
        length += lengthChange;
        scoreText.text =  score.ToString();
        lengthText.text =  length.ToString();
    }



    void Update() 
    {
        switch ((score/10)+1)
        {
            case 1:
                BgColor("#FFFFFFFF", "1");//白，赤橙黄绿青蓝紫橙红
                break;
            case 2:
                BgColor("#EAE26CFF", "2");//黄
                break;
            case 3:
                BgColor("#EAB26CFF", "3"); //橙
                break;
            case 4:
                BgColor("#BAEA6CFF", "4");//绿
                break;
            case 5:
                BgColor("#6CEAD6FF", "5");//青
                break;
            case 6:
                BgColor("#6CC5EAFF", "6");//蓝
                break;
            case 7:
                BgColor("#8A6CEAFF", "7"); //紫
                break;
            case 8:
                BgColor("#EA736CFF", "8");// 红
                break;
            default:
                BgColor("#FFFFFFFF", "无尽阶段");//白
                break;
        }
    }
    public void BgColor(string hexColor,string level)//背景关卡颜色
    {
        ColorUtility.TryParseHtmlString(hexColor, out tmpColor);
        bg.color = tmpColor;
        msgText.text = level;
    }

    private static MainUIControl _instance;//静态类，通过类名访问
    public static MainUIControl Instance//获取
    {
        get
        {
            return _instance;
        }
    }


    public void Pause()
    {
        isPause = !isPause;//取反
        if (isPause)
        {
            Time.timeScale = 0;
            pauseButton.GetComponent<Image>().sprite = pauseSpriteArr[1];
        }
        else if (!isPause)
        {
            Time.timeScale = 1;
            pauseButton.GetComponent<Image>().sprite = pauseSpriteArr[0];
        }
    }

    public void Home()
    {
        UnityEngine.SceneManagement.SceneManager.LoadScene(1);//加载build etting添加的场景，看具体拖的index
    }
}
