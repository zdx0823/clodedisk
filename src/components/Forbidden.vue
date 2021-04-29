<template>
  <div class="w-full h-full flex justify-center items-center text-gray-900 bg-gray-100">
      {{msg}}
  </div>
</template>

<script>
export default {
    name: 'Forbidden',
    data: () => ({

    }),
    methods: {},
    computed: {

        msg () {
            return this.$route.meta.msg
                ? this.$route.meta.msg
                : '您无权访问该页面'
        }

    },
    mounted () {}
}
</script>

<style>

</style>