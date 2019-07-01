<template>
  <div class="note">
      <div>
        <textarea class="txtnote" autofocus="autofocus" v-model="note" @keyup.enter="donote()" :placeholder="placeholder"></textarea>
      </div>
  </div>
</template>

<script>
const i18n = require("../lib/locale").i18n
export default {
  name: 'notebox',
  data(){
    return {
      note:"",
      placeholder:""
    }
  },
  mounted:function(){
    var locale = i18n.locale
    this.placeholder = i18n[locale].lang.message['keynote']
  },
  methods:{
    donote(){
      this.$emit('donote',this.note)
    }
  }
}
</script>

<style>
.note{
  border:1px solid #3366FF;
  width:200px;height:100px;
  position:absolute;
  top:24%;
  left:24%;
  z-index:2;
  background: white;
  border-radius:10px;
}

.txtnote{
  width:200px;
  height:100px;
  border-style:none;
  background:transparent;
}

.txtnote:focus{ outline:none; }
</style>
