<template>
  <div>
    <div class="toolbar">
      <ul class="box">
       <li><img src="assets/book.png"/></li>
       <li @click="list('dir')"><img src="assets/dir.png"/></li>
       <li><img src="assets/note.png"/></li>

       <li @click="cansearch = !cansearch"><img src="assets/search.png"/></li>
       <li><img src="assets/font.png"/></li>
       <li @click="list('bookmark')"><img src="assets/bookmark.png"/></li>

      <transition name="search">
        <div v-if="cansearch" class="search">
          <input type="text" autofocus="autofocus" v-model="key" @keydown="submit($event)" placeholder="请输入关键字"/>
        </div>
      </transition>
      </ul>
    </div>
    <div id="container" class="book" @dblclick="open" @dragstart='dstart($event)' @dragover='dstart($event)' @drop="drag($event)"></div>
    <div class="leftbar" @click="prev"><img class="leftImg" src="assets/left.png"/></div>
    <div class="rightbar" @click="next"><img class="rightImg" src="assets/right.png"/></div>
    <transition name="bounce">
      <div class="menu" v-if="show">
        <div class="title">{{title}}</div>
        <ul>
          <li v-for="item in dirs" @click="nav(item.href)">{{item.label}}</li>
        </ul>
      </div>
    </transition>
    <div class="status" v-if="percentage>0">位置 {{percentage}}%</div>
  </div>
</template>

<script>
const {ipcRenderer} = require('electron')
import Reader from "./Reader";
import pdfReader from "./pdfReader"
const path = require('path')

export default {
  name: 'book',
  data () {
    return {
      dirs:[],
      percentage:0,
      title:"目录",
      cansearch:false,
      show:false
    }
  },
  mounted:function(){
    this.book = new Reader()
    this.pdf = new pdfReader()
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
    this.actions = ["openbook","underline","comment","zoomIn","zoomOut","list","bookmark","search","changeTheme","changeFont","bookClick"]
    this.listener()
  },
  methods:{
    listener(){
      this.actions.forEach(action => {
        console.log(action)
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
        this.book.createBook(p,"container",(percent)=>{
          this.percentage = percent
        })
      }
      if(path.extname(p)==".pdf")
      {
        alert("dev...")
        this.pdf.openPdf(p)
      }
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
    list(action){
      if(action == "dir"){
        this.dirs = this.book.listdir()
        this.title = "目录"
      }
      if(action == "bookmark"){
        this.dirs = this.book.listBookmarks()
        this.title = "书签"
      }
      if(action == "search"){
        this.dirs = this.search()
        this.title = "搜索"
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
      this.book.comment(range)
    },
    submit(e){
     var evt = window.event || e;
      if (evt.keyCode == 13){
        this.list("search")
        this.canSearch = false
      }
    },
    search(){
      var results = []
      this.book.search(this.key,(ret) => {
        ret.forEach( (result,index) => {
          results.push({label:index+". "+result.excerpt.trim(),href:result.cfi})
        })
      })
      return results
    },
    bookClick(){
      this.show = this.cansearch = false
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
    }
  }
}
</script>
