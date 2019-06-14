<template>
  <div class="status" v-if="percentage>0">位置 {{percentage}}%
    <div class="bookmark"><img v-if="bookmarked" src="assets/bookmark_sel.png"/></div>
  </div>
</template>

<script>
export default {
  name: 'statubar',
  props: ['percentage','bookmarked']
}
</script>
