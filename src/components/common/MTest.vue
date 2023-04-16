<template>
  <div>
    {{ res }}
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
    }
  },
  computed: {
    res() {
      console.log(234234)

      return this.items.length
    }
  }
}
</script>

<style>

</style>