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
          <li></li>
          <li></li>
          <li></li>
          <li></li>
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
    find(){
      this.canTool=true
      this.canSearch=true
    },
    unfind(){
      alert(11)
      this.canTool=false
      this.canSearch=false
    }
  }
}
</script>
