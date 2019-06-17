<template>
  <div>

    <toolbar ref="toolbar" @bookmark="bookmark" @list="list" @submit="submit" @openbook="open"
    @zoomIn="zoomIn" @zoomOut="zoomOut" @theme="changeTheme" @font="changeFont" :canbook="canbook"></toolbar>

    <div v-if="!ispdf" id="container" class="book" @dblclick="open" @dragstart='dstart($event)' @dragover='dstart($event)' @drop="drag($event)">
        <span class="tips"><img src="../assets/document.png" /> Double click or drag file here.</span>
    </div>
    <div v-if="ispdf" class="pdfcontainer">
      <canvas id="can" class="canvas"></canvas>
    </div>
    <div class="leftbar" @click="prev"><img class="leftImg" src="../assets/left.png"/></div>
    <div class="rightbar" @click="next"><img class="rightImg" src="../assets/right.png"/></div>

    <leftbar :show="show" :title="title" :dirs="dirs" @nav="nav"></leftbar>

    <statubar :percentage="percentage" :bookmarked="bookmarked"></statubar>
    <notebox v-if="cannote" @donote="donote"></notebox>
  </div>
</template>

<script>
const {ipcRenderer} = require('electron')
import Reader from "./Reader";
import pdfReader from "./pdfReader"
import statubar from "./statubar"
import toolbar from "./toolbar"
import leftbar from "./leftbar"
import notebox from "./notebox"
const path = require('path')

export default {
  name: 'book',
  components:{
		statubar,toolbar,leftbar,notebox
	},
  data () {
    return {
      dirs:[],
      percentage:0,
      title:"目录",
      bookmarked:false,
      show:false,
      cannote:false,
      canbook:false,
      ispdf:false,
    }
  },
  mounted:function(){
    window.addEventListener('keyup', (e)=>{
      if(e.key == "ArrowLeft"){
        this.prev()
      }
      if(e.key == "ArrowRight"){
        this.next()
      }
      if(e.key == "ArrowUp"){
        this.zoomIn()
      }
      if(e.key == "ArrowDown"){
        this.zoomOut()
      }
    }, true)
    this.actions = ["openbook","underline","keynote","comment","zoomIn","zoomOut","list","bookmark","find","changeTheme","changeFont","bookClick"]
    this.listener()
  },
  methods:{
    listener(){
      this.actions.forEach(action => {
        ipcRenderer.on(action,(e,data)=> {
          this[action](data)
        })
      })
    },
    open:function(){
      ipcRenderer.send('openbook')
    },
    drag:function(e){
      e.preventDefault()
      var path=e.dataTransfer.files[0].path
      this.openbook(path)
    },
    dstart:function(e){
      e.preventDefault()
    },
    openbook:function(p){
      if(path.extname(p)==".epub")
      {
        this.book = new Reader()
        this.book.createBook(p,"container",(percent,bookmarked)=>{
          this.percentage = percent
          this.bookmarked = bookmarked
          this.canbook = true
        })
        this.ispdf = false
      }
      if(path.extname(p)==".pdf")
      {
        this.book = new pdfReader()
        this.book.openPdf(p)
        this.ispdf = true
      }
      ipcRenderer.send('appendmenu')
    },
    prev:function(){
      this.book.prev()
    },
    next:function(){
      this.book.next()
    },
    zoomIn:function(){
      this.book.zoomIn()
    },
    zoomOut:function(){
      this.book.zoomOut()
    },
    list(action,key){
      if(action == "dir"){
        this.dirs = this.book.listdir()
        this.title = "目录"
      }
      if(action == "bookmark"){
        this.dirs = this.book.listBookmarks()
        this.title = "书签"
      }
      if(action == "search"){
        this.dirs = this.search(key)
        this.title = "搜索"
      }
      if(action == "note"){
        this.dirs = this.book.listnotes()
        this.title = "备注"
      }
      this.show = !this.show
    },
    nav(url){
      this.book.nav(url)
      this.show = false
    },
    bookmark(){
      this.book.bookmark()
    },
    underline(range){
      this.book.underline(range)
    },
    comment(range){
      //this.book.comment(range)
      this.currentcfi=range
      this.cannote=true
    },
    keynote(obj){
      this.book.keynote(obj)
    },
    submit(e,key){
      var evt = window.event || e
      if (evt.keyCode == 13){
        this.list("search",key)
      }
    },
    find(){
      this.$refs.toolbar.find();
    },
    search(key){
      var results = []
      this.book.search(key,(ret) => {
        ret.forEach( (result,index) => {
          results.push({label:index+". "+result.excerpt.trim(),href:result.cfi})
        })
      })
      return results
    },
    bookClick(){
      this.show = this.cannote = false
      this.$refs.toolbar.unfind()
    },
    changeTheme(name){
      this.book.themeList.forEach(theme => {
        if(theme.name == name)
          document.body.style.background = theme.style.body.background
      })
      this.book.changeTheme(name)
    },
    changeFont(name){
      this.book.changeFont(name)
    },
    donote(note){
      this.book.donote(note,this.currentcfi)
      this.cannote = false
    }
  }
}
</script>