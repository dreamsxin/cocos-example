// panel/index.js, this filename needs to match the one registered in package.json
const Fs = require('fs');
Editor.Panel.extend({
  // css style for panel
  style: Fs.readFileSync(Editor.url('packages://hqq/panel/index.css'), 'utf8'),
  // html template for panel
  template: Fs.readFileSync(Editor.url('packages://hqq/panel/index.html'), 'utf8'),
  // element and variable binding
  $: {
    hall: '#hall',
    tod: '#tod',
    bcbm: '#bcbm',
    bjl: '#bjl',
    brnn: '#brnn',
    cbcb: '#cbcb',
    cyqp: '#cyqp',
    ddz: '#ddz',
    dzpk: '#dzpk',
    ebg: '#ebg',
    ermj: '#ermj',
    hbld: '#hbld',
    hbsl: '#hbsl',
    hh: '#hh',
    hwby: '#hwby',
    jbpby: '#jbpby',
    lhd: '#lhd',
    lp: '#lp',
    pccp: '#pccp',
    pdk: '#pdk',
    qznn: '#qznn',
    sbty: '#sbty',
    sgj: '#sgj',
    shaibao: '#shaibao',
    sss: '#sss',
    szwg: '#szwg',
    zjh: '#zjh',
    zrsx: '#zrsx',
    hallVersion: "#hallversion",
    todVersion: "#todversion",
    bcbmVersion: "#bcbmversion",
    bjlVersion: "#bjlversion",
    brnnVersion: "#brnnversion",
    cbcbVersion: "#cbcbversion",
    cyqpVersion: "#cyqpversion",
    ddzVersion: "#ddzversion",
    dzpkVersion: "#dzpkversion",
    ebgVersion: "#ebgversion",
    ermjVersion: "#ermjversion",
    hbldVersion: "#hbldversion",
    hbslVersion: "#hbslversion",
    hhVersion: "#hhversion",
    hwbyVersion: "#hwbyversion",
    jbpbyVersion: "#jbpbyversion",
    lhdVersion: "#lhdversion",
    lpVersion: "#lpversion",
    pccpVersion: "#pccpversion",
    pdkVersion: "#pdkversion",
    qznnVersion: "#qznnversion",
    sbtyVersion: "#sbtyversion",
    sgjVersion: "#sgjversion",
    shaibaoVersion: "#shaibaoversion",
    sssVersion: "#sssversion",
    szwgVersion: "#szwgversion",
    zjhVersion: "#zjhversion",
    zrsxVersion: "#zrsxversion",
    btn: '#btn',
    language: '#language',
    country: '#country',
    currency: '#currency',
  },
  // method executed when template and styles are successfully loaded and initialized
  ready() {
    this.versionjson = null
    this.versionList = {}
    this.versionjsonPath = Editor.Project.path + "\\version.json"
    this.initVersion()
    this.addEventListener()
  },
  // 刷新子游戏版本
  initVersion() {
    if (!this.versionjson) {
      let tversionjson = Fs.readFileSync(this.versionjsonPath, 'utf8')
      this.versionjson = JSON.parse(tversionjson)
      for (let k in this.versionjson.version) {
        let vList = this.versionjson.version[k].split(".")
        let num = parseInt(vList[2])
        this.versionList[k] = num
      }
    } else {
      for (let k in this.versionList) {
        let num = this.versionList[k]
        let vList = this.versionjson.version[k].split(".")
        this.versionjson.version[k] = vList[0] + "." + vList[1] + "." + num
      }
    }
    this.$hallVersion.innerText = '(' + this.versionjson.version["hall"] + ')'
    this.$todVersion.innerText = '(' + this.versionjson.version['21d'] + ')'
    this.$bcbmVersion.innerText = '(' + this.versionjson.version["bcbm"] + ')'
    this.$bjlVersion.innerText = '(' + this.versionjson.version["bjl"] + ')'
    this.$brnnVersion.innerText = '(' + this.versionjson.version["brnn"] + ')'
    this.$cbcbVersion.innerText = '(' + this.versionjson.version["cbcb"] + ')'
    this.$cyqpVersion.innerText = '(' + this.versionjson.version["cyqp"] + ')'
    this.$ddzVersion.innerText = '(' + this.versionjson.version["ddz"] + ')'
    this.$dzpkVersion.innerText = '(' + this.versionjson.version["dzpk"] + ')'
    this.$ebgVersion.innerText = '(' + this.versionjson.version["ebg"] + ')'
    this.$ermjVersion.innerText = '(' + this.versionjson.version["ermj"] + ')'
    this.$hbldVersion.innerText = '(' + this.versionjson.version["hbld"] + ')'
    this.$hbslVersion.innerText = '(' + this.versionjson.version["hbsl"] + ')'
    this.$hhVersion.innerText = '(' + this.versionjson.version["hh"] + ')'
    this.$hwbyVersion.innerText = '(' + this.versionjson.version["hwby"] + ')'
    this.$jbpbyVersion.innerText = '(' + this.versionjson.version["jbpby"] + ')'
    this.$lhdVersion.innerText = '(' + this.versionjson.version["lhd"] + ')'
    this.$lpVersion.innerText = '(' + this.versionjson.version["lp"] + ')'
    this.$pccpVersion.innerText = '(' + this.versionjson.version["pccp"] + ')'
    this.$pdkVersion.innerText = '(' + this.versionjson.version["pdk"] + ')'
    this.$qznnVersion.innerText = '(' + this.versionjson.version["qznn"] + ')'
    this.$sbtyVersion.innerText = '(' + this.versionjson.version["sbty"] + ')'
    this.$sgjVersion.innerText = '(' + this.versionjson.version["sgj"] + ')'
    this.$shaibaoVersion.innerText = '(' + this.versionjson.version["shaibao"] + ')'
    this.$sssVersion.innerText = '(' + this.versionjson.version["sss"] + ')'
    this.$szwgVersion.innerText = '(' + this.versionjson.version["szwg"] + ')'
    this.$zjhVersion.innerText = '(' + this.versionjson.version["zjh"] + ')'
    this.$zrsxVersion.innerText = '(' + this.versionjson.version["zrsx"] + ')'
  },
  // 按钮事件添加
  addEventListener() {
    this.$language.addEventListener('confirm', () => {
      Editor.Ipc.sendToMain('hqq:changeLanguage', this.$language.value, () => {
      });
    })
    this.$country.addEventListener('confirm', () => {
      Editor.Ipc.sendToMain('hqq:changeCountry', this.$country.value, () => {
      });
    })
    this.$currency.addEventListener('confirm', () => {
      Editor.Ipc.sendToMain('hqq:changeCurrency', this.$currency.value, () => {
      });
    })
    this.$btn.addEventListener('confirm', () => {
      Fs.writeFile(this.versionjsonPath, JSON.stringify(this.versionjson), 'utf8', function (err) {
        if (err) {
          throw err
        } else {
          Editor.Panel.close('hqq')
        }
      });
    })
    this.$hall.addEventListener('confirm', () => {
      if (this.$hall.checked) {
        this.versionList["hall"] += 1
      } else {
        this.versionList["hall"] -= 1
      }
      this.initVersion()
    })
    this.$tod.addEventListener('confirm', () => {
      if (this.$tod.checked) {
        this.versionList['21d'] += 1
      } else {
        this.versionList['21d'] -= 1
      }
      this.initVersion()
    })
    this.$bcbm.addEventListener('confirm', () => {
      if (this.$bcbm.checked) {
        this.versionList["bcbm"] += 1
      } else {
        this.versionList["bcbm"] -= 1
      }
      this.initVersion()
    })
    this.$bjl.addEventListener('confirm', () => {
      if (this.$bjl.checked) {
        this.versionList["bjl"] += 1
      } else {
        this.versionList["bjl"] -= 1
      }
      this.initVersion()
    })
    this.$brnn.addEventListener('confirm', () => {
      if (this.$brnn.checked) {
        this.versionList["brnn"] += 1
      } else {
        this.versionList["brnn"] -= 1
      }
      this.initVersion()
    })
    this.$cbcb.addEventListener('confirm', () => {
      if (this.$cbcb.checked) {
        this.versionList["cbcb"] += 1
      } else {
        this.versionList["cbcb"] -= 1
      }
      this.initVersion()
    })
    this.$cyqp.addEventListener('confirm', () => {
      if (this.$cyqp.checked) {
        this.versionList["cyqp"] += 1
      } else {
        this.versionList["cyqp"] -= 1
      }
      this.initVersion()
    })
    this.$ddz.addEventListener('confirm', () => {
      if (this.$ddz.checked) {
        this.versionList["ddz"] += 1
      } else {
        this.versionList["ddz"] -= 1
      }
      this.initVersion()
    })
    this.$dzpk.addEventListener('confirm', () => {
      if (this.$dzpk.checked) {
        this.versionList["dzpk"] += 1
      } else {
        this.versionList["dzpk"] -= 1
      }
      this.initVersion()
    })
    this.$ebg.addEventListener('confirm', () => {
      if (this.$ebg.checked) {
        this.versionList["ebg"] += 1
      } else {
        this.versionList["ebg"] -= 1
      }
      this.initVersion()
    })
    this.$ermj.addEventListener('confirm', () => {
      if (this.$ermj.checked) {
        this.versionList["ermj"] += 1
      } else {
        this.versionList["ermj"] -= 1
      }
      this.initVersion()
    })
    this.$hbld.addEventListener('confirm', () => {
      if (this.$hbld.checked) {
        this.versionList["hbld"] += 1
      } else {
        this.versionList["hbld"] -= 1
      }
      this.initVersion()
    })
    this.$hbsl.addEventListener('confirm', () => {
      if (this.$hbsl.checked) {
        this.versionList["hbsl"] += 1
      } else {
        this.versionList["hbsl"] -= 1
      }
      this.initVersion()
    })
    this.$hh.addEventListener('confirm', () => {
      if (this.$hh.checked) {
        this.versionList["hh"] += 1
      } else {
        this.versionList["hh"] -= 1
      }
      this.initVersion()
    })
    this.$hwby.addEventListener('confirm', () => {
      if (this.$hwby.checked) {
        this.versionList["hwby"] += 1
      } else {
        this.versionList["hwby"] -= 1
      }
      this.initVersion()
    })
    this.$jbpby.addEventListener('confirm', () => {
      if (this.$jbpby.checked) {
        this.versionList["jbpby"] += 1
      } else {
        this.versionList["jbpby"] -= 1
      }
      this.initVersion()
    })
    this.$lhd.addEventListener('confirm', () => {
      if (this.$lhd.checked) {
        this.versionList["lhd"] += 1
      } else {
        this.versionList["lhd"] -= 1
      }
      this.initVersion()
    })
    this.$lp.addEventListener('confirm', () => {
      if (this.$lp.checked) {
        this.versionList["lp"] += 1
      } else {
        this.versionList["lp"] -= 1
      }
      this.initVersion()
    })
    this.$pccp.addEventListener('confirm', () => {
      if (this.$pccp.checked) {
        this.versionList["pccp"] += 1
      } else {
        this.versionList["pccp"] -= 1
      }
      this.initVersion()
    })
    this.$pdk.addEventListener('confirm', () => {
      if (this.$pdk.checked) {
        this.versionList["pdk"] += 1
      } else {
        this.versionList["pdk"] -= 1
      }
      this.initVersion()
    })
    this.$qznn.addEventListener('confirm', () => {
      if (this.$qznn.checked) {
        this.versionList["qznn"] += 1
      } else {
        this.versionList["qznn"] -= 1
      }
      this.initVersion()
    })
    this.$sbty.addEventListener('confirm', () => {
      if (this.$sbty.checked) {
        this.versionList["sbty"] += 1
      } else {
        this.versionList["sbty"] -= 1
      }
      this.initVersion()
    })
    this.$sgj.addEventListener('confirm', () => {
      if (this.$sgj.checked) {
        this.versionList["sgj"] += 1
      } else {
        this.versionList["sgj"] -= 1
      }
      this.initVersion()
    })
    this.$shaibao.addEventListener('confirm', () => {
      if (this.$shaibao.checked) {
        this.versionList["shaibao"] += 1
      } else {
        this.versionList["shaibao"] -= 1
      }
      this.initVersion()
    })
    this.$sss.addEventListener('confirm', () => {
      if (this.$sss.checked) {
        this.versionList["sss"] += 1
      } else {
        this.versionList["sss"] -= 1
      }
      this.initVersion()
    })
    this.$szwg.addEventListener('confirm', () => {
      if (this.$szwg.checked) {
        this.versionList["szwg"] += 1
      } else {
        this.versionList["szwg"] -= 1
      }
      this.initVersion()
    })
    this.$zjh.addEventListener('confirm', () => {
      if (this.$zjh.checked) {
        this.versionList["zjh"] += 1
      } else {
        this.versionList["zjh"] -= 1
      }
      this.initVersion()
    })
    this.$zrsx.addEventListener('confirm', () => {
      if (this.$zrsx.checked) {
        this.versionList["zrsx"] += 1
      } else {
        this.versionList["zrsx"] -= 1
      }
      Editor.log("zrsx")
    })
  },
  // register your ipc messages here
  messages: {

  }
});