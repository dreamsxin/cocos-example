
const fs = require('fs');
const path = require('path');

let curpath = path.resolve('./');
let versionEmailPath = curpath + '/versionemail.txt'
let m_commit = ""
let m_huanjin = ""
let m_pinpai = ""
var parseArguments = function () {
    var i = 2;
    while (i < process.argv.length) {
        var arg = process.argv[i];
        switch (arg) {
            case '-commit':
            case '-c':
                m_commit = process.argv[i + 1];
                i += 2;
                break;
            case '--huanjin':
            case '-h':
                m_huanjin = process.argv[i + 1];
                i += 2;
                break;
            case '--pinpai':
            case '-p':
                m_pinpai = process.argv[i + 1];
                i += 2;
                break;
            default:
                i++;
                break;
        }
    }
    choiceType()
}

let emaillist = [
    "一、项目名称：\n",
    "特斯特娛樂\n",
    ".\n",
    "二、环境说明：\n",
    "HQQ - 新环境 - online\n",
    ".\n",
    "三、原因说明：\n",
    "熱更新\n",
    ".\n",
    "四、更新内容：\n",
    "熱更新\n",
    ".\n",
    "五、数据库操作：无\n",
    ".\n",
    "六、系统配置(系统有关相关配置) ：无\n",
    ".\n",
    "七、仓库路径及版本号：\n",
    "品牌：特斯特\n",
    "repo: http://git.539316.com/lemo/upgrade-server\n",
    "branch: master\n",
    "gitCommit： 4602985b7a089e05cf151135c02ab538238a62a4\n",
    "八、備註\n",
    "无\n"
]
let weblist = [
    "一、项目名称:\n",
    "web-mobile:网页版\n",
    "品牌：特斯特\n\n",
    "二、更新内容\n",
    "网页版横竖屏切换\n\n",
    "三、环境说明:\n",
    "HQQ-新环境\n\n",
    "四、 数据库操作\n",
    "无\n\n",
    "五、 系统配配置档: 相关配置)\n",
    "文件路徑：web-mobile/test_dev\n",
    "文件路徑：web-mobile/test_pre\n",
    "文件路徑：web-mobile/test_online\n\n",
    "六、 仓库路径及版本号\n\n",
    "七、域名端口\n\n",
    "八、備註\n",
    "开发版本:\n\n",
    "app端:\n\n",
    "web端:\n\n",
    "品牌：特斯特\n",
    "repo : http://git.0717996.com/burt/web_mobile.git\n",
    "branch : master\n",
    "gitCommit： 757bf3299139249e35906d88190e0bc45d90a7c8\n\n",
    "九、 测试建议\n",
    "等待前端更新后查看是否能运行\n\n",
    "十、 回退步骤\n",
]

let pinpailist = {
    "test": "特斯特娛樂",
    "debi": "德比娛樂",
    "xingba": "杏吧娛樂",
    "yuyu": "渔鱼",
}
function choiceType() {
    if (m_huanjin == 'web') {
        produceWebEmail()
    } else {
        produceEmail()
    }
}
// 生成需要发送给运维的email文件
function produceEmail() {
    if (pinpailist[m_pinpai]) {
        emaillist[1] = pinpailist[m_pinpai] + "\n"
        emaillist[17] = "品牌：" + pinpailist[m_pinpai] + "\n"
    } else {
        console.log("不存在这个品牌", m_pinpai)
    }
    emaillist[10] = "热更新\n"
    emaillist[4] = "HQQ - 新环境 - " + m_huanjin + "\n"
    emaillist[20] = "gitCommit：" + m_commit + "\n"
    let email = ""
    for (let i = 0; i < emaillist.length; i++) {
        email += emaillist[i]
    }
    fs.writeFile(versionEmailPath, email, 'utf8', function (err) {
        if (err) {
            console.log(err)
        };
    });
}

function produceWebEmail() {
    fs.readFile("./settings/builder.json", 'utf8', function (err, files) {
        if (!err) {
            let obj = JSON.parse(files)
            let huanjin = 'dev'
            if (obj.title == "AGdev" || obj.title == "Test_dev" || obj.title == "Testdev") {
                huanjin = 'dev'
            } else if (obj.title == "TstPre") {
                huanjin = 'pre'
            } else {
                huanjin = 'online'
            }
            weblist[6] = "HQQ-新环境:" + huanjin + "\n\n"
            weblist[22] = "gitCommit：" + m_commit + "\n\n"
            let email = ""
            for (let i = 0; i < weblist.length; i++) {
                email += weblist[i]
            }
            fs.writeFile(versionEmailPath, email, 'utf8', function (err) {
                if (err) {
                    console.log(err)
                };
            });
        } else {
            console.log("读取builder.json文件报错", err)
        }
    })
}

parseArguments()