<template>
  <div class="themeSwap">
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
</template>

<script>
export default {
  name: 'searchbar',
  props:['sel','selFont'],
  methods:{
    font(name){
      this.$emit("font",name)
    },
    theme(name){
      this.$emit("theme",name)
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

.correct{
  display:block;color:#FFF;height:30px;line-height:30px;text-align:center;font-size:18px;
}

.correct-dark{
  display:block;height:30px;line-height:30px;text-align:center;font-size:18px;
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
