<template>
  <div>

    <toolbar ref="toolbar" @bookmark="bookmark" @list="list" @search="dosearch" @openbook="open"
    @zoomIn="zoomIn" @zoomOut="zoomOut" @theme="changeTheme" @font="changeFont" :canbook="canbook" :ispdf="ispdf"></toolbar>

    <div v-if="!ispdf" id="container" class="book" @dblclick="open" @dragstart='dstart($event)' @dragover='dstart($event)' @drop="drag($event)">
        <span class="tips"><img @click="open" src="../assets/document.png" /> <i18n :prop="'tip'" /></span>
    </div>
    <div v-if="ispdf" class="pdfcontainer">

    </div>
    <div v-if="!ispdf" class="leftbar" @click="prev"><img class="leftImg" src="../assets/left.png"/></div>
    <div v-if="!ispdf" class="rightbar" @click="next"><img class="rightImg" src="../assets/right.png"/></div>

    <leftbar :show="show" :title="title" :dirs="dirs" @nav="nav"></leftbar>

    <statubar :percentage="percentage" :bookmarked="bookmarked" :ispdf="ispdf" :page="page" :total="total"></statubar>
    <notebox v-if="cannote" @donote="donote"></notebox>
  </div>
</template>

<script>
const {ipcRenderer} = require('electron')
import Reader from "../lib/Reader";
import pdfReader from "../lib/pdfReader"
import statubar from "./statubar"
import toolbar from "./toolbar"
import leftbar from "./leftbar"
import notebox from "./notebox"
import i18n from "./i18n"

const li18n = require("../lib/locale").i18n
const path = require('path')

export default {
  name: 'book',
  components:{
		statubar,toolbar,leftbar,notebox,i18n
	},
  data () {
    return {
      dirs:[],
      percentage:0,
      title:"",
      bookmarked:false,
      show:false,
      cannote:false,
      canbook:false,
      ispdf:false,
      total:0,
      page:0
    }
  },
  mounted:function(){
    window.addEventListener('scroll', () => {
      if(this.ispdf){
        var obj = this.book.process(window.scrollY)
        this.page = obj.page
        this.total = obj.total
      }
    })
    window.addEventListener('keyup', (e)=>{
      if(e.key == "ArrowLeft"){
        this.prev()
      }
      if(e.key == "ArrowRight"){
        this.next()
      }
    }, true)
    this.actions = ["openbook","underline","keynote","comment","zoomIn","zoomOut","list",
    "bookmark","find","changeTheme","changeFont","bookClick","efc","lfc"]
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

    destoryUI:function(){
      var container = document.querySelector(".pdfcontainer")
      if(container){
        while(container.hasChildNodes()){
          container.removeChild(container.lastChild)
        }
      }
    },

    openbook:function(p){
      this.destoryUI()
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
        this.book.openPdf(p,(pagenum)=>{
          this.page = 1
          this.total = pagenum
        })
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
      }
      if(action == "bookmark"){
        this.dirs = this.book.listBookmarks()
      }
      if(action == "search"){
        this.dirs = this.search(key)
      }
      if(action == "note"){
        this.dirs = this.book.listnotes()
      }
      this.title = li18n[li18n.locale].lang.message[action]
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
      this.currentcfi=range
      this.cannote=true
    },
    keynote(obj){
      this.book.keynote(obj)
    },
    dosearch(e,key){
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
    },
    efc(){
      if(this.ispdf)
        document.body.style.background = "#000"
    },
    lfc(){
      document.body.style.background = "#fff"
    }
  }
}
</script>

<style>
.pdfcontainer{
  overflow: auto;
  text-align: center;
}
.tips{
  text-align: center;
  line-height:600px;
  color: grey;
  width:80%;
  height:80%;
  position:fixed;
}
.book{
  width:80%;
  height: 80%;
  position: fixed;
  left: 10%;
  top: 10%;
}
.leftbar{
  width:10%;
  height: 100%;
  z-index: 9998;
  position: fixed;
  left: 8px;
  top: 8px;
  text-align: center;
  display:inline-block;
}
.rightbar{
  z-index: 9998;
  position: fixed;
  width: 10%;
  height: 100%;
  right: 8px;
  top: 8px;
  display:inline-block;
}

.leftbar:hover .leftImg{
  display:block;
}

.rightbar:hover .rightImg{
  display:block;
}

.leftImg{
  position:fixed;
  top:50%;
  padding-left: 5%;
  display:none;
}

.rightImg{
  position:fixed;
  top:50%;
  padding-left: 5%;
  display:none;
}
</style>
