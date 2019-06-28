<template>
  <div class="themeSwap">
    <ul class="zoom">
      <li @click="zoomOut()"><img src="../assets/zoomOut.png"/></li>
      <li @click="zoomIn()"><img src="../assets/zoomIn.png"/></li>
    </ul>
    <div class="theme">
      <span class="rect default" @click="theme('default')"><span v-if="sel==1" class="correct">√</span></span>
      <span class="rect gold" @click="theme('gold')"><span v-if="sel==2" class="correct">√</span></span>
      <span class="rect eye" @click="theme('eye')"><span v-if="sel==3" class="correct">√</span></span>
      <span class="rect dark" @click="theme('dark')"><span v-if="sel==4" class="correct white">√</span></span>
    </div>
    <div class="font">
      <div class="song pad" @click="font('STSong')"><span v-if="selFont==1">√</span><i18n :prop="'song'" /></div>
      <div class="hei pad" @click="font('STHeiti')"><span v-if="selFont==2">√</span><i18n :prop="'heiti'" /></div>
      <div class="kai pad" @click="font('STKaiti')"><span v-if="selFont==3">√</span><i18n :prop="'kaiti'" /></div>
      <div class="apple pad" @click="font('sans-serif')"><span v-if="selFont==4">√</span><i18n :prop="'serif'" /></div>
    </div>
  </div>
</template>

<script>
import i18n from "./i18n"
export default {
  name: 'searchbar',
  components:{
		i18n
	},
  props:['sel','selFont'],
  methods:{
    font(name){
      this.$emit("font",name)
    },
    theme(name){
      this.$emit("theme",name)
    },
    zoomOut(){
      this.$emit("zoomOut")
    },
    zoomIn(){
      this.$emit("zoomIn")
    }
  }
}
</script>

<style>
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

.white{
  color:#FFF;
}

.correct{
  display:block;height:30px;line-height:30px;text-align:center;font-size:18px;
}
.song{font-family: "STSong";}
.hei{font-family: "STHeiti";}
.kai{font-family: "STKaiti";}
.apple{font-family: "sans-serif";}
.pad{padding: 12px;}

.rect{
  margin-right: 10px;
  border-radius:50%;
  border: 1px;
  display:inline-block;
  height: 30px;
  width: 30px;
  vertical-align: top;
  border-style: solid;
}
.default{background: #fff;}
.gold{background: #f1ece2;}
.eye{background: #ceeaba}
.dark{background: #000;}

</style>
