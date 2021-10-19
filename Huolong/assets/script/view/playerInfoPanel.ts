
import { _decorator, Component, Node, Label, EditBox, Sprite, Button, assetManager, error, SpriteFrame, Texture2D, UITransform } from 'cc';
import { EDITOR } from 'cc/env';
import GameMain from '../controller/gameMain';
import { CharacterInfo } from '../core/characterInfo';
import { Gender, ImageType } from '../core/enumerator';
import { Dropdown } from './component/dropdown';
import { MainScene } from './mainScene';
const { ccclass, property, type } = _decorator;

@ccclass('PlayerInfoPanel')
export default class PlayerInfoPanel extends Component {
    @type(Sprite)
    img_head: Sprite = null
    @type(Label)
    label_name: Label = null
    @type(Button)
    btn_edit_name: Button = null
    @type(EditBox)
    input_name: EditBox = null
    @type(Button)
    btn_edit_name_confirm: Button = null
    @type(Label)
    label_gender: Label = null
    @type(Dropdown)
    dropdown_gender: Dropdown = null
    @type(Label)
    label_age: Label = null
    @type(EditBox)
    input_age: EditBox = null
    @type(EditBox)
    input_stateWords: EditBox = null
    @type(Button)
    btn_close: Button = null

    @property({ visible: false })
    isMine: boolean = false
    @property({ visible: false })
    data: CharacterInfo = null
    @property({ visible: false })
    closeCallback: Function = null

    start() {
        if (!EDITOR) {
            this.img_head.node.on(UITransform.EventType.TOUCH_END, this.onClickHead.bind(this))
            this.btn_edit_name.node.on(UITransform.EventType.TOUCH_END, this.onClickEditName.bind(this))
            this.btn_edit_name_confirm.node.on(UITransform.EventType.TOUCH_END, this.onClickEditNameConfirm.bind(this))
            this.btn_close.node.on(UITransform.EventType.TOUCH_END, this.onClickClose.bind(this))
        }
    }

    setData(info: CharacterInfo, isMine: boolean = false, closeCallback: Function = null) {
        switch (info.imageType) {
            case ImageType.innerId:
                this.img_head.spriteFrame = MainScene.getInstance().getPlayerHeadIcon(info.imageId)
                break
            default:
                assetManager.loadAny(info.imageUrl, (err: Error, texture: Texture2D) => {
                    if (err) {
                        error(err)
                    } else {
                        let sp = new SpriteFrame()
                        sp.texture = texture
                        this.img_head.spriteFrame = sp
                    }
                })
        }
        this.input_name.node.active = false
        this.btn_edit_name_confirm.node.active = false
        this.label_name.string = info.name
        this.input_stateWords.string = info.stateWords
        this.data = info
        this.isMine = isMine
        this.closeCallback = closeCallback
        if (isMine) {
            this.label_gender.string = "性别："
            this.input_name.string = this.label_name.string
            this.label_age.string = "年龄："
            if (info.age == null || info.age == NaN) {
                info.age = 0
            }
            this.input_age.string = info.age.toString()
            this.dropdown_gender.index = info.gender
            this.input_stateWords.placeholder = "请设置您的个性签名"
        } else {
            this.btn_edit_name.node.active = false
            switch (info.gender) {
                case Gender.unknown:
                    this.label_gender.string = "性别：未知"
                    break
                case Gender.male:
                    this.label_gender.string = "性别：男"
                    break
                case Gender.female:
                    this.label_gender.string = "性别：女"
                    break
            }
            this.dropdown_gender.node.active = false
            let age = info.age
            if (info.birthYear != 0) {
                age = (new Date()).getFullYear() - info.birthYear
            }
            if (age <= 0) {
                this.label_age.string = "年龄：未知"
            } else {
                this.label_age.string = "年龄：" + age + "岁"
            }
            this.input_age.node.active = false
            this.input_stateWords.enabled = false
        }
    }

    private onClickHead() {
        if (this.isMine) {
            MainScene.getInstance().showTips("修改头像功能正在建设中...")
        }
    }

    private onClickEditName() {
        this.label_name.node.active = false
        this.btn_edit_name.node.active = false
        this.input_name.node.active = true
        this.btn_edit_name_confirm.node.active = true
    }

    private onClickEditNameConfirm() {
        this.label_name.node.active = true
        if (this.input_name.string != "") {
            this.label_name.string = this.input_name.string
        }
        this.btn_edit_name.node.active = true
        this.input_name.node.active = false
        this.btn_edit_name_confirm.node.active = false
    }

    private onClickClose() {
        if (this.isMine) {
            let ret = this.data
            ret.name = this.label_name.string
            ret.gender = this.dropdown_gender.index
            let age = parseInt(this.input_age.string)
            if (age == null || age == NaN) {
                age = 0
            }
            ret.age = age
            ret.stateWords = this.input_stateWords.string
            GameMain.updateMyInfo(ret)
        }
        if (this.closeCallback != null) {
            this.closeCallback()
        }
        this.node.removeFromParent()
    }
}

