
import { app , dialog , Menu , MenuItem , clipboard , BrowserWindow } from 'electron'
const path = require('path')

const i18n = require('../renderer/locale').i18n

export default class MainMenu{
  constructor(mainWindow) {
    console.dir(i18n)
    this.menu = i18n[app.getLocale()].lang.menu
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
      label:this.menu.view,
      after: ['1'],
      submenu:[
        {
          label:this.menu.themes,
          submenu:[
            {
              label:this.menu.default,
              type:"radio",
              checked:true,
              click:() => {
                this.changeTheme("default")
              }
            },
            {
              label:this.menu.eye,
              type:"radio",
              click:() => {
                this.changeTheme("eye")
              }
            },
            {
              label:this.menu.dark,
              type:"radio",
              click:() => {
                this.changeTheme("dark")
              }
            },
            {
              label:this.menu.gold,
              type:"radio",
              click:() => {
                this.changeTheme("gold")
              }
            }
          ]
        },
        {
          label:this.menu.font,
          submenu:[
            {
              label:this.menu.song,
              type:"radio",
              checked:true,
              click:() => {
                this.changeFont("STSong")
              }
            },
            {
              label:this.menu.heiti,
              type:"radio",
              click:() => {
                this.changeFont("STHeiti")
              }
            },
            {
              label:this.menu.kaiti,
              type:"radio",
              click:() => {
                this.changeFont("STKaiti")
              }
            },
            {
              label:this.menu.serif,
              type:"radio",
              click:() => {
                this.changeFont("sans-serif")
              }
            }
          ]
        },
        {
          label:this.menu.zoomin,
          accelerator:"CmdOrCtrl+Plus",
          click:() => {
            this.zoom("zoomIn")
          }
        },
        {
          label:this.menu.zoomout,
          accelerator:"CmdOrCtrl+-",
          click:() => {
            this.zoom("zoomOut")
          }
        },
        {
          type:"separator"
        },
        {
          label:this.menu.bookmark,
          accelerator:"CmdOrCtrl+B",
          click:() => {
            this.bookmark()
          }
        },
        {
          label:this.menu.bookmarks,
          accelerator:"CmdOrCtrl+L",
          click:() => {
            this.list("bookmark")
          }
        },
        {
          type:"separator"
        },
        {
          label:this.menu.directory,
          accelerator:"CmdOrCtrl+T",
          click:() => {
            this.list("dir")
          }
        },
        {
          label:this.menu.find,
          accelerator:"CmdOrCtrl+F",
          click:() => {
            this.find()
          }
        }
      ]
    }
    this.template = [
      {
        label:this.menu.file,
        submenu:[
          {
            role: "about"
          },
          {
            type:"separator"
          },
          {
            label:this.menu.open,
            accelerator:"CmdOrCtrl+O",
            click:() => {
              this.openbook()
            }
          },
          {
            label:this.menu.quit,
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
        label:this.menu.window,
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
  	menu.append(new MenuItem({ label: this.menu.keynote,submenu:[{label:this.menu.yellow,click:() => {
        this.mainWindow.webContents.send("keynote",{range:data.range,color:"yellow"})
    }},
    {label:this.menu.green,click:() => {
        this.mainWindow.webContents.send("keynote",{range:data.range,color:"green"})
    }},
    {label:this.menu.cyan,click:() => {
        this.mainWindow.webContents.send("keynote",{range:data.range,color:"cyan"})
    }},
    {label:this.menu.pink,click:() => {
        this.mainWindow.webContents.send("keynote",{range:data.range,color:"pink"})
    }},
    {label:this.menu.purple,click:() => {
        this.mainWindow.webContents.send("keynote",{range:data.range,color:"purple"})
    }},
    {label: this.menu.underline,click:() => {
        this.mainWindow.webContents.send("underline",data.range)
    }}] }))
    menu.append(new MenuItem({ label: this.menu.comment,click:() => {
        this.mainWindow.webContents.send("comment",data.range)
    } }))
  	menu.append(new MenuItem({ type: 'separator' }))
  	menu.append(new MenuItem({ label: this.menu.copy, click:() => {
  				clipboard.writeText(data.text)
  			}
  	}))
  	const win = BrowserWindow.fromWebContents(event.sender)
  	menu.popup(win);
  }

}
