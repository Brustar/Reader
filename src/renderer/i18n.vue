<template>
  <span>{{text}}</span>
</template>

<script>
const i18n = require("./locale").i18n
export default {
  name: 'i18n',
  props:['prop'],
  data () {
    return {
      text:''
    }
  },
  mounted:function(){
    var locale = i18n.locale
    this.text = i18n[locale].lang.message[this.prop]
  }
}
</script>
