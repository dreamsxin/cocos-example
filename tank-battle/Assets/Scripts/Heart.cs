using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Heart : MonoBehaviour
{
    public Sprite brokenHeartSprite;
    private SpriteRenderer sr;
    private bool isDead=false;

    public AudioClip dieAudio;

    public GameObject explosionEffectPrefab;

    void Awake()
    {
        sr = GetComponent<SpriteRenderer>();
    }

    void Die()
    {
        if(!isDead)
        { 
            sr.sprite=brokenHeartSprite;
            Instantiate(explosionEffectPrefab,transform.position,transform.rotation);
        }
        isDead=true;//À¿¡À≤ª‘Ÿ±¨’®
        PlayerManager.Instance.isDefeat=true;
        AudioSource.PlayClipAtPoint(dieAudio,transform.position);
    }
    
}
