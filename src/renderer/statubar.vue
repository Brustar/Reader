<template>
  <div class="status">
    <div v-if="percentage>0 && !ispdf"><i18n :prop="'position'" /> {{percentage}}%
      <div class="bookmark"><img v-if="bookmarked" src="assets/bookmark_sel.png"/></div>
    </div>
    <div v-if="ispdf"><i18n :prop="'page'" /> {{page}} / {{total}}</div>
</div>
</template>

<script>
import i18n from "./i18n"
//const li18n = require("./locale").i18n
export default {
  name: 'statubar',
  props: ['percentage','bookmarked','ispdf','page','total'],
  components:{
		i18n
	},
  data(){
    return {
      status:""
    }
  },
  /*mounted:function(){
    var locale = li18n.locale
    this.status = li18n.signMix(li18n[locale].lang.message['status'],this.page,this.total)
  }*/
}
</script>

<style>
.status{
  width:100%;
  height:30px;
  position:fixed;
  z-index: 9999;
  text-align: center;
  bottom: 0;
  font-size: 12px;
  color: gray;
  font-weight:bold;
  font-family: sans-serif;
}
.bookmark{
  float: right;
  padding-right: 5%;
}
</style>
