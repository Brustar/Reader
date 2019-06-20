<template>
  <div class="status">
    <div v-if="percentage>0 && !ispdf">位置 {{percentage}}%
      <div class="bookmark"><img v-if="bookmarked" src="assets/bookmark_sel.png"/></div>
    </div>
    <div v-if="ispdf">第{{page}}页，共{{total}}页</div>
</div>
</template>

<script>
export default {
  name: 'statubar',
  props: ['percentage','bookmarked','ispdf','page','total']
}
</script>

<style>
.status{
  width:100%;
  height:30px;
  position:fixed;
  z-index: 9999;
  text-align: center;
  bottom: 0;
  font-size: 12px;
  color: gray;
  font-weight:bold;
  font-family: sans-serif;
}
.bookmark{
  float: right;
  padding-right: 5%;
}
</style>
