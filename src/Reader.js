const {ipcRenderer} = require('electron')
const ePub = require('epubjs').default

export default class Reader {
  constructor() {
    this.fontsize = 16
    this.maxSize = 24
    this.minSize = 8
    this.themeList = require('./mainThemes')
  }

  createBook(path,dom,progress) {
    /*if(this.rendition){
      this.rendition.clear()
    }*/
    this.book = ePub(path)
    this.rendition = this.book.renderTo(dom, {width: "100%", height: "100%"})
    this.themes = this.rendition.themes
    this.registerThemes()
    var key = this.book.key(path)+'-locations';
    var cfi = localStorage.getItem(key);
    if(cfi)
      this.rendition.display(cfi)
    else {
      this.rendition.display()
    }

    this.book.loaded.metadata.then(function(meta){
      document.title = meta.title
    })

    this.book.ready.then(()=>{
        return this.book.locations.generate()
    })

    this.rendition.on('relocated', (location) => {
				var percent = this.book.locations.percentageFromCfi(location.start.cfi)
				var percentage = Math.floor(percent * 100)
        localStorage.setItem(this.book.key(path)+'-locations', location.start.cfi);

        //var page = this.book.pageList.pageFromCfi(location.start.cfi)
        var bookmarked = this.isBookmarked(location.start.cfi)!=-1
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

    this.path = path
    var bkey = this.book.key(path)+'-bookmarks'
    var store = JSON.parse(localStorage.getItem(bkey))
    this.bookmarks = store ? store : []
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
	   ipcRenderer.send('sigShowRightClickMenu',text)
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
      var size = this.fontsize++
      size = size > this.maxSize?this.maxSize:size
      this.themes.fontSize(size+'px')
      if(size == this.maxSize)
        this.fontsize = size
    }
  }

  zoomOut(){
    if(this.themes){
      var size = this.fontsize--
      size = size < this.minSize?this.minSize:size
      this.themes.fontSize(size +'px')
      if(size == this.minSize)
        this.fontsize = size
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

  listBookmarks(){
    var bks = []
    if(this.bookmarks.length>0){
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
	   return this.bookmarks.indexOf(cfi);
  }

  bookmark(){
    var cfi = this.rendition.currentLocation().start.cfi
		var bookmarked = this.isBookmarked(cfi);
    if(bookmarked == -1){
      this.bookmarks.push(cfi)
    }
    localStorage.setItem(this.book.key(this.path)+'-bookmarks', JSON.stringify(this.bookmarks))
  }

  comment(range){
    this.rendition.annotations.highlight(range, {}, (e) => {
    })
    this.rendition.annotations.mark(range, {}, (e) => {
    })
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
