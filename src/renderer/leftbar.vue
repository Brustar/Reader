<template>
  <transition name="bounce">
    <div class="menu" v-if="show">
      <div class="title">{{title}}</div>
      <ul>
        <li v-for="item in dirs" @click="nav(item.href)">{{item.label}}</li>
      </ul>
      <div class="empty" v-if="dirs.length==0"><i18n :prop="'empty'" />{{title}}</div>
    </div>

  </transition>
</template>

<script>
import i18n from "./i18n"

export default {
  name: 'leftbar',
  props: ['show','title','dirs'],
  components:{
		i18n
	},
  methods:{
    nav(url){
      this.$emit('nav',url)
    }
  }
}
</script>

<style>
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0%   {left:-300px; top:0px;}
  100%  {left:0px; top:0px;}
}

.menu{
  width:300px;
  height:100%;
  background:#eee;
  position:fixed;
  z-index: 9999;
  overflow: auto;
}

.title{
  color: gray;
  text-align: center;
  padding: 10px;
  font-family: sans-serif;
}

.empty{
  padding: 0px;
  width:300px;
  height:900px;
  text-align: center;
  vertical-align:middle;
  display: table-cell;
}
</style>
