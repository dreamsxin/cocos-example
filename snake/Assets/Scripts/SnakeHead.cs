using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

enum Direction : int//移动的方向
{
    Up = 0,
    Down = 1,
    Left = 2,
    Right = 3
}
public class SnakeHead : MonoBehaviour
{

    public int step = 40;//步长
    private int x;//下一次位置的增量
    private int y;
    private Vector3 headPos;//头的位置

    public float velocity = 0.35f;//多长时间调用一次

    private bool isDie = false;
    public GameObject dieEffect;

    public AudioClip eatClip;
    public AudioClip dieClip;

    void Awake()
    {
        snakeHead = GameObject.Find("Game").transform;//蛇身的父节点

        //接收Start场景的皮肤设置
        gameObject.GetComponent<Image>().sprite = Resources.Load<Sprite>(PlayerPrefs.GetString("snakeHead", "sh01"));//蛇头
        bodySpriteArr[0] = Resources.Load<Sprite>(PlayerPrefs.GetString("snakeBody01", "sb0101"));//蛇身
        bodySpriteArr[1] = Resources.Load<Sprite>(PlayerPrefs.GetString("snakeBody02", "sb0102"));//蛇身

    }
    void Start()
    {
        InvokeRepeating("HeadMove", 0, velocity);//重复调用("方法", 调用初始时间, 调用间隔时间);
        Turn(Direction.Up);//一开始向上移动
    }
    void Update()
    {
        Mouse();
    }
    bool IsPauseAndDie()//按键时的共同if条件
    {
        if (MainUIControl.Instance.isPause == false && isDie == false)
            return true;
        else
            return false;
    }
    void Die()
    {
        AudioSource.PlayClipAtPoint(dieClip, Vector3.zero);//吃食物音效
        CancelInvoke();
        isDie = true;
        Instantiate(dieEffect);
        Record();
        StartCoroutine(GameOver(1.5f));
    }
    void Record()//last best分数、长度记录
    {
        PlayerPrefs.SetInt("lastScore", MainUIControl.Instance.score);//键值对
        PlayerPrefs.SetInt("lastLength", MainUIControl.Instance.length);
        if (PlayerPrefs.GetInt("bestScore", 0) < MainUIControl.Instance.score)
        {
            PlayerPrefs.SetInt("bestScore", MainUIControl.Instance.score);
            PlayerPrefs.SetInt("bestLength", MainUIControl.Instance.length);
        }
    }
    IEnumerator GameOver(float time)//重载场景
    {
        yield return new WaitForSeconds(time);//等待几秒
        UnityEngine.SceneManagement.SceneManager.LoadScene(0);
    }

    void Mouse()//加速和移动
    {

        if (Input.GetKeyDown(KeyCode.Space)&& IsPauseAndDie())//加速移动,暂停时不能加速  
        {
            CancelInvoke();
            InvokeRepeating("HeadMove", 0, velocity - 0.2f);
        }
        if (Input.GetKeyUp(KeyCode.Space) && IsPauseAndDie())//恢复速度
        {
            CancelInvoke();
            InvokeRepeating("HeadMove", 0, velocity);
        }
        if (Input.GetKey(KeyCode.W) && y != -step && IsPauseAndDie())//不能反方向
        {
            Turn(Direction.Up);
        }
        if (Input.GetKey(KeyCode.S) && y != step && IsPauseAndDie())
        {
            Turn(Direction.Down);

        }
        if (Input.GetKey(KeyCode.A) && x != step && IsPauseAndDie())
        {
            Turn(Direction.Left);

        }
        if (Input.GetKey(KeyCode.D) && x != -step && IsPauseAndDie())
        {
            Turn(Direction.Right);

        }

    }
    void Turn(Direction direction)//x，y偏移量，旋转方向
    {
        switch (direction)
        {
            case (Direction)0:
                {
                    x = 0;
                    y = step;
                    Rotate(0);
                    break;
                }
            case (Direction)1:
                {
                    x = 0;
                    y = -step;
                    Rotate(180);
                    break;
                }
            case (Direction)2:
                {
                    x = -step;
                    y = 0;
                    Rotate(90);
                    break;
                }
            case (Direction)3:
                {
                    x = step;
                    y = 0;
                    Rotate(-90);
                    break;
                }
        }

    }
    void Rotate(int z)//旋转头部
    {
        gameObject.transform.localRotation = Quaternion.Euler(0, 0, z);
    }
    void HeadMove()//移动
    {
        //蛇头移动
        headPos = gameObject.transform.localPosition;//保存下来蛇头移动前的位置
        gameObject.transform.localPosition = new Vector3(headPos.x + x, headPos.y + y, headPos.z);//蛇头向期望位置移动

        BodyMove(headPos);
    }

    /// <summary>
    /// 11
    /// </summary>
    private bool isAte = false;
    private void OnTriggerEnter2D(Collider2D collision)
    {
        // if(collision.tag=="Food")
        if (collision.gameObject.CompareTag("Food"))//吃食物
        {
            Destroy(collision.gameObject);//销毁
            MainUIControl.Instance.UpdateUI(5, 1);
            FoodMaker.Instance.MakeFood();
            if (Random.Range(0, 100) < 20)//20%概率生成奖励
            {
                FoodMaker.Instance.MakeReward();
            }

            isAte = true;
            Grow();
        }
        if (collision.gameObject.CompareTag("Reward"))//吃奖励
        {
            Destroy(collision.gameObject);//销毁

            MainUIControl.Instance.UpdateUI(Random.Range(-10,10),1);

            if (Random.Range(0, 100) < 20)//20%概率生成奖励
            {
                FoodMaker.Instance.MakeReward();
            }

            isAte = true;
            Grow();
        }
        if (collision.gameObject.CompareTag("Body"))//撞到自己
        {
            Die();
        }
        if (collision.gameObject.CompareTag("Border"))//到边界
        {
            if (MainUIControl.Instance.hasBorder)//边界模式
            {
                Die(); 
            }
            else
            {       
                float x = transform.localPosition.x;
                float y = transform.localPosition.y;
                float z = transform.localPosition.z;
                switch (collision.gameObject.name)
                {
                    case "Up":
                        transform.localPosition = new Vector3(x, -y+step, z);
                        break;
                    case "Down":
                        transform.localPosition = new Vector3(x, -y - step, z);
                        break;
                    case "Left":
                        transform.localPosition = new Vector3(-x - step, y, z);
                        break;
                    case "Right":
                        transform.localPosition = new Vector3(-x + step, y, z);
                        break;
                }
            }
        }
    }
    /// <summary>
    /// 12
    /// </summary>
    public List<Transform> bodyList = new List<Transform>();
    public GameObject bodyPrefab;//预制体
    public Sprite[] bodySpriteArr;//图片数组
    private Transform snakeHead;//父节点 

    public void BodyMove(Vector3 headPos)
    { 
        //增加身长的一种方法
        if (isAte)
            //Grow();
            isAte = false;

        //身体移动
        if (bodyList.Count > 0)
        {
            //方法一
            //Transform lastBody = bodyList[bodyList.Count - 1];
            //lastBody.localPosition = headPos;
            //bodyList.Insert(0, lastBody);
            //bodyList.RemoveAt(bodyList.Count - 1);

            //方法二
            for (int i = bodyList.Count - 1; i > 0; i--)//前一个赋值给后一个
            {
                bodyList[i].localPosition = bodyList[i - 1].localPosition;
            }


            bodyList[0].localPosition = headPos;
        }
    }
    public void Grow()
    {
        AudioSource.PlayClipAtPoint(eatClip, Vector3.zero);//吃食物音效
        //GameObject body = Instantiate(bodyPrefab);
        GameObject body = Instantiate(bodyPrefab,new Vector3(2000,2000,0),Quaternion.identity);//初始位置扔外面
        body.transform.SetParent(snakeHead, false);//不保持世界坐标
        //图
        int index = (bodyList.Count % 2 == 0) ? 0 : 1;
        body.GetComponent<Image>().sprite = bodySpriteArr[index];

        bodyList.Add(body.transform);

    }








}
