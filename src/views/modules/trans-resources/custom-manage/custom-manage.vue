<template>
  <div class="carrier-detail">
    <el-radio-group v-model="radioType" style="margin-bottom: 10px">
      <el-radio-button :label="1">已合并</el-radio-button>
      <el-radio-button :label="2">待合并</el-radio-button>
    </el-radio-group>
    <div v-if="radioType === 1">
      <customer ref="customerRef"></customer>
    </div>
    <div v-if="radioType === 2">
      <delegate @handleClose="handleCancel"></delegate>
    </div>
  </div>
</template>

<script>
  import Customer from './customer'
  import Delegate from '../delegate/delegate'
  export default {
    data () {
      return {
        radioType: 1,
        clickFlag: true,
        customVisible: false,
        performanceVisible: false
      }
    },
    components: {
      Customer,
      Delegate
    },
    activated () {
      this.init()
    },
    methods: {
      init () {
        this.radioType = 1
        this.$nextTick(() => {
          this.$refs.customerRef.init()
        })
      },
      handleCancel () {
        this.radioType = 1
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
