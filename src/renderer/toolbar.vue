<template>
  <div :class="canTool?'toolbarShow':'toolbar'">
    <ul :class="canTool?'boxShow':'box'">
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
      <searchbar v-if="canSearch" @search="submit"></searchbar>
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
import searchbar from "./searchbar"
export default {
  name: 'toolbar',
  components:{
		searchbar
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
    submit(e,key){
      console.log(key)
      this.$emit('submit',e,key)
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
  display:inline-block;
}
.toolbar:hover{
  background:#eee;
}
.toolbar:hover .box{
  display:block;
}
.toolbarShow{
  z-index: 9999;
  width:100%;
  height:30px;
  position:fixed;
  top:0;
  display:block;
  background:#eee;
}
.box>li{padding:0; margin:0;list-style:none;text-align: center;}
.box{ width:250px;margin-left: 0px;display:none;}
.box li{ float:left; width:21px; height:16px; margin-right:10px;margin-top:7px;}
.boxShow>li{padding:0; margin:0;list-style:none;text-align: center;}
.boxShow li{ float:left; width:21px; height:16px; margin-right:10px;margin-top:7px;}
.boxShow{ width:186px;margin-left: 0px;display:block; }

.themeSwap{
  left: 0px;
  padding: 10px;
  height:300px;
  width:200px;
  top:30px;
  position: fixed;
  background: #eee;
  text-align: center;
  border-radius:5px;
}

.themeSwap>.zoom>li{
  float: left;
  height: 40px;
  width: 45%;
  padding-right: 20px;
  box-sizing: border-box;
}

.font{
  position:fixed;
  left:50px;
  margin-top: 20px;
}

.theme{
  margin-top: 20px;
}

.correct{
  display:block;color:#FFF;height:30px;line-height:30px;text-align:center;font-size:18px;
}

.correct-dark{
  display:block;height:30px;line-height:30px;text-align:center;font-size:18px;
}
.arrow{
  position:fixed;
  left: 172px;
  top:5px;
}
.song{font-family: "STSong";padding: 12px;}
.hei{font-family: "STHeiti";padding: 12px;}
.kai{font-family: "STKaiti";padding: 12px;}
.apple{font-family: "sans-serif";padding: 12px;}

.default{margin-right: 10px;border-radius:50%;border: 1px;display:inline-block;height: 30px;width: 30px;vertical-align: top;border-style: solid; background: #fff;}
.gold{margin-right: 10px; border-radius:50%;border: 1px;display:inline-block;height: 30px;width: 30px;vertical-align: top;border-style: solid; background: #f1ece2;}
.eye{margin-right: 10px; border-radius:50%;border: 1px;display:inline-block;height: 30px;width: 30px;vertical-align: top;border-style: solid; background: #ceeaba}
.dark{margin-right: 10px; border-radius:50%;border: 1px;display:inline-block;height: 30px;width: 30px;vertical-align: top;border-style: solid; background: #000;}

</style>
