<template>
  <ul>
    <li v-for="(x,index) in items" @dblclick="remove(index)">{{x}}</li>
  </ul>
</template>

<script>
const {ipcRenderer} = require('electron')

export default {
  name: 'main',
  data () {
    return {
      items: []
    }
  },
  mounted: function () {
    ipcRenderer.on("item:add",(e,item)=> {
      this.items.unshift(item)
    })
    ipcRenderer.on("item:clear",()=> {
      //this.items = []
      this.items.splice(0)
    })
  },
  methods:{
    remove:function(i){
      this.items.splice(i,1)
    }
  }
}
</script>
