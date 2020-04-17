<template>
  <el-date-picker
    class="datePicker"
    style="width: 100%"
    v-model="data"
    :type="type"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    v-bind="$attrs"
    v-on="$listeners">
  </el-date-picker>
</template>
<script>
  export default {
    name: 'xklDatePicker',
    props: {
      value: {
      }
    },
    data () {
      return {
        type: this.$attrs.type ? this.$attrs.type : 'daterange'
      }
    },
    watch: {
    },
    created () {
    },
    methods: {
    },
    computed: {
      data: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('input', value)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .datePicker{
    /deep/ .el-range-separator{
      text-align: center;
      display: block;
      width: 20px;
    }
  }
</style>
