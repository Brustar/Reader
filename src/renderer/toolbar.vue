<template>
  <div :class="canTool?'toolbar tshow':'toolbar thidden'">
    <ul :class="canTool?'box show':'box hidden'">
     <li @click="openbook()"><img src="../assets/book.png"/></li>
     <li v-if="canbook && !ispdf" @click="list('dir')"><img src="../assets/dir.png"/></li>
     <li v-if="canbook && !ispdf" @click="list('note')"><img src="../assets/note.png"/></li>

     <li v-if="canbook && !ispdf" @click="canTheme=false;canSearch=!canSearch"><img src="../assets/search.png"/></li>
     <li v-if="canbook && !ispdf" @click="canSearch=false;canTheme=!canTheme"><img src="../assets/font.png"/></li>
     <li v-if="canbook && !ispdf" @click="bookmark()"><img src="../assets/bookmark.png"/></li>
     <li v-if="canbook && !ispdf" @click="list('bookmark')" class="arrow"><img src="../assets/arrow_down.png"/></li>

     <li @click="zoomIn()" v-if="ispdf"><img src="../assets/zoom_in.png"/></li>
     <li @click="zoomOut()" v-if="ispdf"><img src="../assets/zoom_out.png"/></li>

    <transition name="search">
      <searchbar v-if="canSearch" @search="search"></searchbar>
      <themebar v-if="canTheme" :sel="sel" :selFont="selFont" @font="font" @theme="theme"></themebar>
    </transition>
    </ul>
  </div>
</template>

<script>
import searchbar from "./searchbar"
import themebar from "./themebar"
export default {
  name: 'toolbar',
  components:{
		searchbar,themebar
	},
  props: ['canbook','ispdf'],
  data() {
    return {
      canSearch:false,
      canTheme:false,
      canTool:false,
      sel:0,
      selFont:0
    }
  },
  methods:{
    search(e,key){
      this.$emit('search',e,key)
    },
    openbook(){
      this.$emit('openbook')
    },
    list(name){
      this.$emit('list',name)
    },
    zoomIn(){
      this.$emit('zoomIn')
    },
    zoomOut(){
      this.$emit('zoomOut')
    },
    theme(name){
      if(name == 'default')
        this.sel=1
      if(name == 'gold')
        this.sel=2
      if(name == 'eye')
        this.sel=3
      if(name == 'dark')
        this.sel=4
      this.$emit('theme',name)
    },
    font(name){
      if(name == 'STSong')
        this.selFont=1
      if(name == 'STHeiti')
        this.selFont=2
      if(name == 'STKaiti')
        this.selFont=3
      if(name == 'sans-serif')
        this.selFont=4
      this.$emit('font',name)
    },
    bookmark(){
      this.$emit('bookmark')
    },
    find(){
      this.canTool=true
      this.canSearch=true
    },
    unfind(){
      this.canTool=false
      this.canSearch=false
    }
  }
}
</script>

<style>
.toolbar{
  z-index: 9999;
  width:100%;
  height:30px;
  position:fixed;
  top:0;
}
.thidden{
  display:inline-block;
}
.toolbar:hover{
  background:#eee;
}
.toolbar:hover .box{
  display:block;
}
.tshow{
  display:block;
  background:#eee;
}
.box>li{padding:0; margin:0;list-style:none;text-align: center;}
.box{ width:250px;margin-left: 0px;}
.box li{ float:left; width:21px; height:16px; margin-right:10px;margin-top:7px;}
.hidden{display:none;}
.show{display:block; }

.arrow{
  position:fixed;
  left: 172px;
  top:5px;
}

</style>
