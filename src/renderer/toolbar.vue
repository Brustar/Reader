<template>
  <div :class="canTool?'toolbarShow':'toolbar'">
    <ul :class="canTool?'boxShow':'box'">
     <li @click="openbook()"><img src="../assets/book.png"/></li>
     <li v-if="canbook" @click="list('dir')"><img src="../assets/dir.png"/></li>
     <li v-if="canbook" @click="list('note')"><img src="../assets/note.png"/></li>

     <li v-if="canbook" @click="canTheme=false;canSearch=!canSearch"><img src="../assets/search.png"/></li>
     <li v-if="canbook" @click="canSearch=false;canTheme=!canTheme"><img src="../assets/font.png"/></li>
     <li v-if="canbook" @click="bookmark()"><img src="../assets/bookmark.png"/></li>
     <li v-if="canbook" @click="list('bookmark')" class="arrow"><img src="../assets/arrow_down.png"/></li>

    <transition name="search">
      <div v-if="canSearch" class="search">
        <input type="text" autofocus="autofocus" v-model="keyword" @keydown="submit($event)" placeholder="请输入关键字"/>
      </div>
      <div v-if="canTheme" class="themeSwap">
        <ul class="zoom">
          <li @click="zoomOut()"><img src="../assets/zoomOut.png"/></li>
          <li @click="zoomIn()"><img src="../assets/zoomIn.png"/></li>
        </ul>
        <div class="theme">
          <span class="default" @click="theme('default')"><span v-if="sel==1" class="correct-dark">√</span></span>
          <span class="gold" @click="theme('gold')"><span v-if="sel==2" class="correct-dark">√</span></span>
          <span class="eye" @click="theme('eye')"><span v-if="sel==3" class="correct-dark">√</span></span>
          <span class="dark" @click="theme('dark')"><span v-if="sel==4" class="correct">√</span></span>
        </div>
        <div class="font">
          <div class="song" @click="font('STSong')"><span v-if="selFont==1">√</span>宋体</div>
          <div class="hei" @click="font('STHeiti')"><span v-if="selFont==2">√</span>黑体</div>
          <div class="kai" @click="font('STKaiti')"><span v-if="selFont==3">√</span>楷体</div>
          <div class="apple" @click="font('sans-serif')"><span v-if="selFont==4">√</span>苹方</div>
        </div>
      </div>
    </transition>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'toolbar',
  props: ['canbook'],
  data() {
    return {
      canSearch:false,
      canTheme:false,
      canTool:false,
      sel:0,
      selFont:0,
      keyword:""
    }
  },
  methods:{
    submit(e){
      this.$emit('submit',e,this.keyword)
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
