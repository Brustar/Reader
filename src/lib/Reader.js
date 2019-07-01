const {ipcRenderer} = require('electron')
import db from '../lib/db'
const ePub = require('epubjs').default

export default class Reader {
  constructor() {
    this.fontsize = 1
    this.maxSize = 3
    this.minSize = 0.3
    this.themeList = require('../renderer/mainThemes')
    this.$db = new db()
  }

  createBook(path,dom,progress) {
    if(this.book){
      this.book.destroy()
    }
    this.book = ePub(path)
    this.rendition = this.book.renderTo(dom, {width: "100%", height: "100%"})
    this.themes = this.rendition.themes
    this.registerThemes()
    this.$db.insertBook(path)
    this.$db.findLocation(path,(cfi) => {
      if(cfi != "")
        this.rendition.display(cfi)
      else {
        this.rendition.display()
      }
    })

    this.book.loaded.metadata.then((meta) => {
      document.title = meta.title
    })

    this.book.ready.then(()=>{
        return this.book.locations.generate()
    })

    this.rendition.on('relocated', (location) => {
				var percent = this.book.locations.percentageFromCfi(location.start.cfi)
				var percentage = Math.floor(percent * 100)
        this.$db.updateLocation(path,location.start.cfi)
        //var page = this.book.pageList.pageFromCfi(location.start.cfi)
        var bookmarked = this.isBookmarked(location.start.cfi)
        progress(percentage,bookmarked)
		})

    this.rendition.on("click",() => {
      ipcRenderer.send('bookClick')
    })

    this.rendition.on("selected", (cfiRange, contents) => {
       this.book.getRange(cfiRange).then((range) => {
         if(range){
           this.showRightClickMenu({text:range.toString(),range:cfiRange})
         }
       })
   })

    this.initData(path)
  }

  initData(path){
    this.path = path
    this.$db.findBookmarks(path,(bookmarks) =>{
      this.bookmarks = bookmarks
    })
    //var nkey = this.book.key(path)+'-notes'
    this.$db.findNotes(path,(notes) => {
      this.notes = notes
    })
  }

  underline(range){
    this.rendition.annotations.underline(range, {}, (e) => {
    })
    //this.rendition.annotations.remove(range, "highlight")
  }

  registerThemes(){
    this.themeList.forEach(theme => {
      this.themes.register(theme.name,theme.style)
    })
  }

  showRightClickMenu(text){
	   ipcRenderer.send('rightClick',text)
  }

  prev(){
    if(this.rendition)
      this.rendition.prev()
  }

  next(){
    if(this.rendition)
      this.rendition.next()
  }

  zoomIn(){
    if(this.themes){
      this.fontsize = this.fontsize+0.1
      this.fontsize = this.fontsize > this.maxSize?this.maxSize:this.fontsize
      this.themes.fontSize(this.fontsize+'em')
    }
  }

  zoomOut(){
    if(this.themes){
      this.fontsize = this.fontsize-0.1
      this.fontsize = this.fontsize < this.minSize?this.minSize:this.fontsize
      this.themes.fontSize(this.fontsize +'em')
    }
  }

  changeTheme(name){
    this.themes.select(name)
  }

  listdir(){
    var dirs = []
    this.book.loaded.navigation.then((toc) => {
      toc.forEach(function(chapter) {
        var c = {}
        c.label = chapter.label.trim()
        c.href = chapter.href
        dirs.push(c)
      })
    })
    return dirs
  }

  nav(url){
    if(this.rendition)
      this.rendition.display(url)
  }

  changeFont(font){
    if(this.themes)
      this.themes.font(font)
  }

  listnotes(){
    var nts = []
    if(this.notes.length>0){
      this.notes.forEach(obj =>{
        var n={}
        n.label = obj.note
        n.href = obj.cfi

        nts.push(n)
      })
    }
    return nts
  }

  listBookmarks(){
    var bks = []
    if(this.bookmarks && this.bookmarks.length>0){
      this.bookmarks.forEach(cfi => {
        var b = {}

        var spineItem = this.book.spine.get(cfi)
        if (spineItem.index in this.book.navigation.toc) {
  			     var tocItem = this.book.navigation.toc[spineItem.index]
  			     b.label = tocItem.label.trim()
  		  } else {
  			     b.label = cfi
  		  }
        b.href = cfi
        bks.push(b)
      })
    }
    return bks
  }

  isBookmarked(cfi) {
	   return this.bookmarks && this.bookmarks.indexOf(cfi)>-1;
  }

  bookmark(){
    var cfi = this.rendition.currentLocation().start.cfi
		var bookmarked = this.isBookmarked(cfi);
    if(!bookmarked){
      this.bookmarks.push(cfi)
    }
    this.$db.updateBookmarks(this.path,this.bookmarks)
  }

  keynote(obj){
    this.rendition.annotations.highlight(obj.range, {}, (e) => {alert('clicked')},"",{"fill": obj.color, "fill-opacity": "0.4", "mix-blend-mode": "multiply"})
    this.rendition.annotations.mark(obj.range, {}, (e) => {
    })
  }

  donote(note,cfi){
    this.keynote({range:cfi,color:"yellow"})
    this.notes.push({note:note,cfi:cfi,modified:Date()})
    this.$db.updateNotes(this.path,this.notes)
  }

  search(q,dosearch){
    let item = this.book.spine.get(this.rendition.location.start.cfi)
    item.load(this.book.load.bind(this.book)).then(item.find.bind(item, q))
    .finally(item.unload.bind(item))
    .then(results => {
      Promise.resolve([].concat.apply([], results)).then(result =>{
        dosearch(result)
      })
    })
  }

}
