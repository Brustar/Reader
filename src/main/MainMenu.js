
import { app , dialog , Menu , MenuItem , clipboard , BrowserWindow , nativeImage } from 'electron'

export default class MainMenu{
  constructor(mainWindow) {
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
      label:"View",
      after: ['1'],
      submenu:[
        {
          label:"themes",
          submenu:[
            {
              label:"default",
              type:"radio",
              checked:true,
              click:() => {
                this.changeTheme("default")
              }
            },
            {
              label:"eye",
              type:"radio",
              click:() => {
                this.changeTheme("eye")
              }
            },
            {
              label:"dark",
              type:"radio",
              click:() => {
                this.changeTheme("dark")
              }
            },
            {
              label:"gold",
              type:"radio",
              click:() => {
                this.changeTheme("gold")
              }
            }
          ]
        },
        {
          label:"Font",
          submenu:[
            {
              label:"宋体",
              type:"radio",
              checked:true,
              click:() => {
                this.changeFont("STSong")
              }
            },
            {
              label:"黑体",
              type:"radio",
              click:() => {
                this.changeFont("STHeiti")
              }
            },
            {
              label:"楷体",
              type:"radio",
              click:() => {
                this.changeFont("STKaiti")
              }
            },
            {
              label:"苹方",
              type:"radio",
              click:() => {
                this.changeFont("sans-serif")
              }
            }
          ]
        },
        {
          label:"zoom in",
          accelerator:"CmdOrCtrl+Plus",
          click:() => {
            this.zoom("zoomIn")
          }
        },
        {
          label:"zoom out",
          accelerator:"CmdOrCtrl+-",
          click:() => {
            this.zoom("zoomOut")
          }
        },
        {
          type:"separator"
        },
        {
          label:"bookmark",
          accelerator:"CmdOrCtrl+B",
          click:() => {
            this.bookmark()
          }
        },
        {
          label:"list bookmarks",
          accelerator:"CmdOrCtrl+L",
          click:() => {
            this.list("bookmark")
          }
        },
        {
          type:"separator"
        },
        {
          label:"directory",
          accelerator:"CmdOrCtrl+T",
          click:() => {
            this.list("dir")
          }
        },
        {
          label:"find...",
          accelerator:"CmdOrCtrl+F",
          click:() => {
            this.find()
          }
        }
      ]
    }
    this.template = [
      {
        id: '1',
        label:"File",
        submenu:[
          {
            label:"about us",
            role: "about"
          },
          {
            type:"separator"
          },
          {
            label:"open book",
            accelerator:"CmdOrCtrl+O",
            click:() => {
              this.openbook()
            }
          },
          {
            label:"quit",
            accelerator:"CmdOrCtrl+Q",
            click(){
              app.quit();
            }
          }
        ]
      },
      {
        label:"Window",
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
          filters:[{ name: 'Books', extensions: ['epub', 'pdf', 'txt'] }]
      }, (files) => {
          if (files){
            this.mainWindow.webContents.send("openbook",files[0])
            this.appendMenu()
          }
      })
  }

  appendMenu(){
    if(this.template.indexOf(this.viewMenu)==-1){
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
        //shell.openExternal('https://www.baidu.com')
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
