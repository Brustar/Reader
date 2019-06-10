
import { app , dialog , Menu , MenuItem , clipboard , BrowserWindow } from 'electron'

export default class MainMenu{
  constructor(mainWindow) {
    this.mainWindow = mainWindow
    this.devMenu = {
      label:"developer tools",
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
    this.template = [
      {
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
        label:"View",
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
            label:"search",
            accelerator:"CmdOrCtrl+F",
            click:() => {
              this.search()
            }
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

  search(){
    this.mainWindow.webContents.send("search")
  }

  changeTheme(name){
    this.mainWindow.webContents.send("theme",name)
  }

  changeFont(name){
    this.mainWindow.webContents.send("font",name)
  }

  openbook(){
    dialog.showOpenDialog({
          properties: ['openFile'],
          filters:[{ name: 'Books', extensions: ['epub', 'pdf', 'txt'] }]
      }, (files) => {
          if (files){
            this.mainWindow.webContents.send("openbook",files[0])
          }
      })
  }

  zoom(action){
    this.mainWindow.webContents.send(action)
  }

  bookmark(){
    this.mainWindow.webContents.send("bookmark")
  }

  createPopupMenu(event,data){
    const menu = new Menu()
  	menu.append(new MenuItem({ label: 'add comment',click:() => {
        //shell.openExternal('https://www.baidu.com')
        this.mainWindow.webContents.send("comment",data.range)
    } }))
  	menu.append(new MenuItem({ type: 'separator' }))
  	menu.append(new MenuItem({ label: 'copy', click:() => {
  				clipboard.writeText(data.text)
  			}
  	}))
    menu.append(new MenuItem({ label: 'underline',click:() => {
        this.mainWindow.webContents.send("underline",data.range)
    } }))
  	const win = BrowserWindow.fromWebContents(event.sender)
  	menu.popup(win);
  }

}
