<template>
  <div class="status" v-if="percentage>0">位置 {{percentage}}%</div>
</template>

<script>
export default {
  name: 'statubar',
  props: ['percentage']
}
</script>
