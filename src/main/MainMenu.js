
import { app , dialog , Menu , MenuItem , clipboard , BrowserWindow } from 'electron'
const path = require('path')

const i18n = {
  // 默认中文
  locale: 'zh-CN',
  messages: {
    // 语言包路径
    'zh-CN': require('../lang/zh'),
    'en-US': require('../lang/en')
  }
}

export default class MainMenu{
  constructor(mainWindow) {
    var menu = i18n.messages[app.getLocale()].lang.menu
    this.mainWindow = mainWindow
    this.devMenu = {
      label:"Developer tools",
      submenu:[{
        label:"toggle devtools",
        accelerator:"CmdOrCtrl+I",
        click:(item,focusWindow) => {
          focusWindow.toggleDevTools();
        }
      },{
        role:"reload"
      }]
    }
    this.viewMenu = {
      label:menu.view,
      after: ['1'],
      submenu:[
        {
          label:menu.themes,
          submenu:[
            {
              label:menu.default,
              type:"radio",
              checked:true,
              click:() => {
                this.changeTheme("default")
              }
            },
            {
              label:menu.eye,
              type:"radio",
              click:() => {
                this.changeTheme("eye")
              }
            },
            {
              label:menu.dark,
              type:"radio",
              click:() => {
                this.changeTheme("dark")
              }
            },
            {
              label:menu.gold,
              type:"radio",
              click:() => {
                this.changeTheme("gold")
              }
            }
          ]
        },
        {
          label:menu.font,
          submenu:[
            {
              label:menu.song,
              type:"radio",
              checked:true,
              click:() => {
                this.changeFont("STSong")
              }
            },
            {
              label:menu.heiti,
              type:"radio",
              click:() => {
                this.changeFont("STHeiti")
              }
            },
            {
              label:menu.kaiti,
              type:"radio",
              click:() => {
                this.changeFont("STKaiti")
              }
            },
            {
              label:menu.serif,
              type:"radio",
              click:() => {
                this.changeFont("sans-serif")
              }
            }
          ]
        },
        {
          label:menu.zoomin,
          accelerator:"CmdOrCtrl+Plus",
          click:() => {
            this.zoom("zoomIn")
          }
        },
        {
          label:menu.zoomout,
          accelerator:"CmdOrCtrl+-",
          click:() => {
            this.zoom("zoomOut")
          }
        },
        {
          type:"separator"
        },
        {
          label:menu.bookmark,
          accelerator:"CmdOrCtrl+B",
          click:() => {
            this.bookmark()
          }
        },
        {
          label:menu.bookmarks,
          accelerator:"CmdOrCtrl+L",
          click:() => {
            this.list("bookmark")
          }
        },
        {
          type:"separator"
        },
        {
          label:menu.directory,
          accelerator:"CmdOrCtrl+T",
          click:() => {
            this.list("dir")
          }
        },
        {
          label:menu.find,
          accelerator:"CmdOrCtrl+F",
          click:() => {
            this.find()
          }
        }
      ]
    }
    this.template = [
      {
        label:menu.file,
        submenu:[
          {
            role: "about"
          },
          {
            type:"separator"
          },
          {
            label:menu.open,
            accelerator:"CmdOrCtrl+O",
            click:() => {
              this.openbook()
            }
          },
          {
            label:menu.quit,
            accelerator:"CmdOrCtrl+Q",
            click(){
              app.quit();
            }
          }
        ]
      },
      {
        id: '1',
        role:"editMenu"
      },
      {
        label:menu.window,
        submenu:[
          {
            role:"Minimize"
          },
          {
            role:"zoom"
          },
          {
            type:"separator"
          },
          {
            role:"toggleFullScreen"
          }
        ]
      }
    ]
  }

  list(action){
    this.mainWindow.webContents.send("list",action)
  }

  find(){
    this.mainWindow.webContents.send("find")
  }

  changeTheme(name){
    this.mainWindow.webContents.send("changeTheme",name)
  }

  changeFont(name){
    this.mainWindow.webContents.send("changeFont",name)
  }

  openbook(){
    dialog.showOpenDialog({
          properties: ['openFile'],
          filters:[{ name: 'Books', extensions: ['epub', 'pdf'] }]
      }, (files) => {
          if (files){
            this.file = files[0]
            this.mainWindow.webContents.send("openbook",this.file)
          }
      })
  }

  appendMenu(){
    var isepub = path.extname(this.file)==".epub"
    if(isepub && this.template.indexOf(this.viewMenu)==-1){
      this.template.splice(1,0,this.viewMenu)
      const menu = Menu.buildFromTemplate(this.template)
      Menu.setApplicationMenu(menu)
    }
  }

  zoom(action){
    this.mainWindow.webContents.send(action)
  }

  bookmark(){
    this.mainWindow.webContents.send("bookmark")
  }

  createPopupMenu(event,data){
    const menu = new Menu()
  	menu.append(new MenuItem({ label: 'keynote',submenu:[{label:"yellow",click:() => {
        this.mainWindow.webContents.send("keynote",{range:data.range,color:"yellow"})
    }},
    {label:"green",click:() => {
        this.mainWindow.webContents.send("keynote",{range:data.range,color:"green"})
    }},
    {label:"cyan",click:() => {
        this.mainWindow.webContents.send("keynote",{range:data.range,color:"cyan"})
    }},
    {label:"pink",click:() => {
        this.mainWindow.webContents.send("keynote",{range:data.range,color:"pink"})
    }},
    {label:"purple",click:() => {
        this.mainWindow.webContents.send("keynote",{range:data.range,color:"purple"})
    }},
    {label: 'underline',click:() => {
        this.mainWindow.webContents.send("underline",data.range)
    }}] }))
    menu.append(new MenuItem({ label: 'add comment',click:() => {
        this.mainWindow.webContents.send("comment",data.range)
    } }))
  	menu.append(new MenuItem({ type: 'separator' }))
  	menu.append(new MenuItem({ label: 'copy', click:() => {
  				clipboard.writeText(data.text)
  			}
  	}))
  	const win = BrowserWindow.fromWebContents(event.sender)
  	menu.popup(win);
  }

}
