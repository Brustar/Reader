<template>
  <transition name="bounce">
    <div class="menu" v-if="show">
      <div class="title">{{title}}</div>
      <ul>
        <li v-for="item in dirs" @click="nav(item.href)">{{item.label}}</li>
      </ul>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'leftbar',
  props: ['show','title','dirs'],
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

</style>
