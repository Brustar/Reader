<template>
  <div class="search">
    <input type="text" class="searchInput" autofocus="autofocus" v-model="keyword" @keydown="search($event)" placeholder="请输入关键字"/>
  </div>
</template>

<script>
export default {
  name: 'searchbar',
  data(){
    return {
      keyword:""
    }
  },
  methods:{
    search(e){
      this.$emit('search',e,this.keyword)
    }
  }
}
</script>

<style>
.search-enter,.search-leave-active{
  opacity: 0;
  transform: translate3d(0,1%,0);
}
.search-enter-active,.search-leave-active{
  transition: all .2s cubic-bezier(0.4,0,0,0);
}
.search{
  left: 0px;
  padding: 10px;
  height:30px;
  width:200px;
  top:30px;
  position: fixed;
  background: #eee;
  text-align: center;
  border-radius:5px;
}
.searchInput{
  height: 20px;
  margin: 10px;
  border-radius:9px;
  padding: 0 10px 0 35px;
  background-image: url(search.png);
  background-repeat: no-repeat;
  background-position: 5px 2px;
}
.searchInput:focus{ outline:none; }
</style>
