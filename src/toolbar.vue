<template>
  <div :class="canTool?'toolbarShow':'toolbar'">
    <ul :class="canTool?'boxShow':'box'">
     <li><img src="assets/book.png"/></li>
     <li @click="list('dir')"><img src="assets/dir.png"/></li>
     <li><img src="assets/note.png"/></li>

     <li @click="canTheme=false;canSearch=!canSearch"><img src="assets/search.png"/></li>
     <li @click="canSearch=false;canTheme=!canTheme"><img src="assets/font.png"/></li>
     <li @click="list('bookmark')"><img src="assets/bookmark.png"/></li>

    <transition name="search">
      <div v-if="canSearch" class="search">
        <input type="text" autofocus="autofocus" v-model="keyword" @keydown="submit($event)" placeholder="请输入关键字"/>
      </div>
      <div v-if="canTheme" class="themeSwap">
        <ul class="zoom">
          <li @click="zoomOut()"><img src="assets/zoomOut.png"/></li>
          <li @click="zoomIn()"><img src="assets/zoomIn.png"/></li>
        </ul>
        <ul class="theme">
          <span class="default" @click="theme('default')"><span v-if="sel==1" class="correct-dark">√</span></span>
          <span class="gold" @click="theme('gold')"><span v-if="sel==2" class="correct-dark">√</span></span>
          <span class="eye" @click="theme('eye')"><span v-if="sel==3" class="correct-dark">√</span></span>
          <span class="dark" @click="theme('dark')"><span v-if="sel==4" class="correct">√</span></span>
        </ul>
        <ul class="font">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </transition>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'toolbar',
  data() {
    return {
      canSearch:false,
      canTheme:false,
      canTool:false,
      sel:0,
      keyword:""
    }
  },
  methods:{
    submit(e){
      this.$emit('submit',e,this.keyword)
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
