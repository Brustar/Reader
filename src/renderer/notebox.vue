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

<style>
.note{
  border:1px solid #3366FF;
  width:200px;height:100px;
  position:absolute;/*让节点脱离文档流,我的理解就是,从页面上浮出来,不再按照文档其它内容布局*/
  top:24%;/*节点脱离了文档流,如果设置位置需要用top和left,right,bottom定位*/
  left:24%;
  z-index:2;/*个人理解为层级关系,由于这个节点要在顶部显示,所以这个值比其余节点的都大*/
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
