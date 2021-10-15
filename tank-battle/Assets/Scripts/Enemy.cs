using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Enemy : MonoBehaviour
{

    float moveSpeed=3f;
    public Sprite[] playerSpriteArr;//拿到右左上下的图片
    private SpriteRenderer sr;//设置上下左右的图片

    public GameObject bulletPrefab;
    private Vector3 bulletEulerAngles;
    private float coolingTiming=0f;
    private float coolingTime=1f;//炮弹冷却

    public GameObject explosionPrefab;//爆炸

    private float h;
    private float v=-1;//向下
    private float turningTiming=0f;//转方向
    private float turningTime=2f;

    void Awake()
    { 
        sr=GetComponent<SpriteRenderer>();
    }
    void Start()
    {
        
    }

    void FixedUpdate()//帧的时长固定
    {
         Move();
         Attack();
    }

    void Move()//移动转弯
    { 
        turningTiming+=Time.fixedDeltaTime;
        if(turningTiming>turningTime)//随机数来给方向
        {
            turningTiming=0f;
            int num=Random.Range(0,8);

            if(num>5)//下
            {
                h=0;
                v=-1;
            }
            else if(num==0)//上
            { 
                h=0;
                v=1;
            }
            if(num>0&&num<=2)//右
            {
                h=1;
                v=0;
            }
            else if(num>2&&num<=4)//左
            { 
                h=-1;
                v=0;
            }
        }

        //移动转弯
        transform.Translate(Vector3.right * h * moveSpeed * Time.fixedDeltaTime, Space.World); 
        if(h>0)
        { 
            sr.sprite=playerSpriteArr[1];//右
            bulletEulerAngles=new Vector3(0,0,-90);
        }
        else if(h<0)
        { 
            sr.sprite=playerSpriteArr[3];//左
            bulletEulerAngles=new Vector3(0,0,90);
        }
              
        if(h!=0)//其他情况按ad键，防止斜着走(冲突时水平优先级高)
            return;

        transform.Translate(Vector3.up * v * moveSpeed * Time.fixedDeltaTime, Space.World);
        if(v>0)
        {
            sr.sprite=playerSpriteArr[0];//上
            bulletEulerAngles=new Vector3(0,0,0);
        }
        else if(v<0)
        {
            sr.sprite=playerSpriteArr[2];//下
            bulletEulerAngles=new Vector3(0,0,-180);
        }
    }
    private void OnCollision2DEnter(Collider2D collision)//避免扎堆
    { 
        if(collision.gameObject.tag=="Enemy")
        { 
            turningTiming=turningTime;//达到转弯时间
        }
    }
    void Attack()//玩家攻击
    { 
        
        coolingTiming+=Time.fixedDeltaTime;

        if(coolingTiming>coolingTime)
        {
            Debug.Log("攻击"+coolingTiming);
            //实例（谁，位置，自身欧拉角+玩家转弯欧拉角）
            //装填炮弹，角度已经调好
            Instantiate(bulletPrefab,transform.position,Quaternion.Euler(bulletEulerAngles+transform.eulerAngles));
            coolingTiming=0f;//下一弹冷却期开始时
        }   
    }
    void Die()//死亡
    { 

        Instantiate(explosionPrefab,transform.localPosition,transform.rotation);
        Destroy(gameObject);
        PlayerManager.Instance.playerScore++;
    }
}
