using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class StartUICnontroller : MonoBehaviour
{
    public Text lastText;
    public Text bestText;


    public Toggle blue;
    public Toggle yellow;
    public Toggle border;
    public Toggle noBorder;

 


    void Awake()
    {
        RecordDisplay();
    }
    // Start is called before the first frame update
    void Start()
    {
        if (PlayerPrefs.GetString("snakeHead", "sh01") == "sh01")//不赋值默认sh01
        {
            blue.isOn = true;
            PlayerPrefs.SetString("snakeHead", "sh01");
            PlayerPrefs.SetString("snakeBody01", "sb0101");
            PlayerPrefs.SetString("snakeBody02", "sb0102");
        }
        else 
        {
            yellow.isOn = true;
            PlayerPrefs.SetString("snakeHead", "sh02");
            PlayerPrefs.SetString("snakeBody01", "sb0201");
            PlayerPrefs.SetString("snakeBody02", "sb0202");
        }

        if (PlayerPrefs.GetInt("border", 1) == 1)//默认有边界
        {
            border.isOn = true;
            PlayerPrefs.SetInt("border", 1);
        }
        else
        {
            noBorder.isOn = true;
            PlayerPrefs.SetInt("border",0);
        }
    }

    // Update is called once per frame
    void Update()
    {
        
    }
    public void loadScence()
    {
        UnityEngine.SceneManagement.SceneManager.LoadScene(0);
    }


    public void RecordDisplay()
    {
        string bestScore = PlayerPrefs.GetInt("bestScore", 0).ToString();
        string bestLength = PlayerPrefs.GetInt("bestLength", 0).ToString();
        string lastScore = PlayerPrefs.GetInt("lastScore", 0).ToString();
        string lastLength = PlayerPrefs.GetInt("lastLength", 0).ToString();

        lastText.text = "上次：分数" + lastScore + "，长度" + lastLength;
        bestText.text = "最好：分数" + bestScore + "，长度" + bestLength;
    }//历史分数长度记录

    public void BlueSelected(bool isOn)
    {
        if (isOn)
        {
            PlayerPrefs.SetString("snakeHead", "sh01");
            PlayerPrefs.SetString("snakeBody01", "sb0101");
            PlayerPrefs.SetString("snakeBody02", "sb0102");
        }
    }//黄皮肤
    public void YellowSelected(bool isOn)
    {
        if (isOn)
        {
            PlayerPrefs.SetString("snakeHead", "sh02");
            PlayerPrefs.SetString("snakeBody01", "sb0201");
            PlayerPrefs.SetString("snakeBody02", "sb0202");
        }
    }//蓝皮肤
    public void BorderSelected(bool isOn)
    {
        if (isOn)
        {
            PlayerPrefs.SetInt("border", 1);
        }
    }//边界
    public void NoBorderSelected(bool isOn)
    {
        if (isOn)
        {
            PlayerPrefs.SetInt("border", 0);
        }
    }//无边界
    public void StartGame()//开始游戏
    {
        UnityEngine.SceneManagement.SceneManager.LoadScene(1);
    }
}
