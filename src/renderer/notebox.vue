<template>
  <div class="note">
      <div>
        <textarea class="txtnote" autofocus="autofocus" v-model="note" @keyup.enter="donote()" placeholder="请输入备注"></textarea>
      </div>
  </div>
</template>

<script>
export default {
  name: 'notebox',
  data(){
    return {
      note:""
    }
  },
  methods:{
    donote(){
      this.$emit('donote',this.note)
    }
  }
}
</script>
