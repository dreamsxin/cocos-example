using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Player : MonoBehaviour
{

    float moveSpeed=3f;
    public Sprite[] playerSpriteArr;//拿到右左上下的图片
    private SpriteRenderer sr;//设置上下左右的图片

    public GameObject bulletPrefab;
    private Vector3 bulletEulerAngles;
    private float coolingTiming=0f;
    private float coolingTime=0.4f;

    public GameObject explosionPrefab;//爆炸

    public bool isDefend=true;//无敌
    private float defendTime=5f;//无敌时间
    public GameObject defendEffectPrefab;

    public AudioClip[] tankAudio;
    private AudioSource nowAudio;


    void Awake()
    { 
        sr=GetComponent<SpriteRenderer>();
        nowAudio=GetComponent<AudioSource>();

    }
    void Start()
    {
        
    }
    void Update()//帧的时长不固定
    {
         Defend();
    }
    void FixedUpdate()//帧的时长固定
    {
        if(!PlayerManager.Instance.isDefeat)//老家还在
        { 
            Move();
            Attack();
        }

    }
    void changeAudio(float speed)
    { 
        if(Mathf.Abs(speed)>0.05f)//移动音效
        {
            nowAudio.clip=tankAudio[1];
            if(! nowAudio.isPlaying)
            {
               nowAudio.Play();
            }
        }
        else 
        { 
            nowAudio.clip=tankAudio[0];
            if(! nowAudio.isPlaying)
            {
               nowAudio.Play();
            }
        }
    }
    void Move()//移动转弯
    { 
        float h=Input.GetAxisRaw("Horizontal");
        float v=Input.GetAxisRaw("Vertical") ;

        changeAudio(h);
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
    void Attack()//玩家攻击
    { 
        coolingTiming+=Time.fixedDeltaTime;

        if(coolingTiming>coolingTime)
        {
            if(Input.GetKeyDown(KeyCode.Space))
            {
                Debug.Log("攻击Attack");
                //实例（谁，位置，自身欧拉角+玩家转弯欧拉角）
                //装填炮弹，角度已经调好
                Instantiate(bulletPrefab,transform.position,Quaternion.Euler(bulletEulerAngles+transform.eulerAngles));
                coolingTiming=0f;//下一弹冷却期开始时
            }  
        }   
    }
    void Die()//死亡
    { 
        if(isDefend) return;

        Instantiate(explosionPrefab,transform.localPosition,transform.rotation);
        Destroy(gameObject);

        PlayerManager.Instance.isDead=true;
    }
    void Defend()//无敌，在预制体制作里面拖的是挂在父节点下的护盾
    { 
        if(isDefend)
        {
            defendEffectPrefab.SetActive(true);

            defendTime-=Time.deltaTime;
            if(defendTime<0)
            {
                isDefend=false;
                defendEffectPrefab.SetActive(false);
            }  
        }
    }
}
