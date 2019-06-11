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
