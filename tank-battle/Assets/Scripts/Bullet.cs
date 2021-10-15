using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Bullet : MonoBehaviour
{

    private float moveSpeed=10;//子弹速度
    public bool isPlayerBullet;

   // public AudioClip fireAudio;

    void Start()
    {

    }
    void Update()
    {
            Shoot();
    }

    void Shoot()//发射炮弹
    {

      transform.Translate(transform.up * moveSpeed * Time.deltaTime,Space.World);
       // AudioSource.PlayClipAtPoint(fireAudio,transform.position);
    }
    private void OnTriggerEnter2D(Collider2D collision)
    {
        switch (collision.tag)
        {
            case "Tank":
                if (!isPlayerBullet)//敌人炮弹
                {
                    Destroy(gameObject);//销毁碰撞后的炮弹
                    Debug.Log("击中玩家");
                    collision.SendMessage("Die");
                }
                break;
            case "Enemy":
                if (isPlayerBullet)//玩家炮弹
                {
                    Destroy(gameObject);//销毁碰撞后的炮弹
                    Debug.Log("击中敌人");
                    collision.SendMessage("Die");
                }
                break;
            case "Heart":
                Destroy(gameObject);//销毁碰撞后的炮弹
                collision.SendMessage("Die");
                break;

            case "Wall":
                Destroy(gameObject);//销毁碰撞后的炮弹
                Destroy(collision.gameObject);
                Debug.Log("Wall");
                break;

            case "Water":
                break;
            case "Barrier":
                Destroy(gameObject);//销毁碰撞后的炮弹
                if(isPlayerBullet)
                { 
                    collision.SendMessage("PlayAudio");
                }               
                break;
            default:
                break;
        }
        //Destroy(gameObject);//销毁碰撞后的炮弹
        
    }
}
