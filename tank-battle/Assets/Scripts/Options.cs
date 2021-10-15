using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;


public class Options : MonoBehaviour
{
    public Toggle single;//单人模式
    public Toggle partner;//双人模式

    public int choice=1;
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        if(single.isOn==true && Input.GetKeyDown(KeyCode.Space))
        { 
            
            UnityEngine.SceneManagement.SceneManager.LoadScene(1);//single
        }
        if(partner.isOn==true && Input.GetKeyDown(KeyCode.Space))
        { 
           UnityEngine.SceneManagement.SceneManager.LoadScene(2);//partner
        }
    }
}
