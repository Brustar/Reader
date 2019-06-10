<template>
  <div class="bindingall">
			<div>
				<input type="text" placeholder="enter item" v-model="phone" autofocus/>
			</div>
			<button @click="addItem">add item</button>
	</div>
</template>

<script>
const {ipcRenderer} = require('electron')

export default {
  name: 'add',
  methods:{
    addItem:function(){
      ipcRenderer.send('item:add',this.phone)
    }
  },
  data () {
    return {
       text: ''
    }
  }
}
</script>
