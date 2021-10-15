using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Explosion : MonoBehaviour
{

    void Start()
    {
        Destroy(gameObject, 0.167f);//爆炸特效几秒消失
    }
}
