<template>
  <el-dialog
    title="运费对账单明细"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-table
      :show-header="false"
      :data="dataList"
      style="width: 100%;">
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="deleteHandle(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="visible = false">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        clickFlag: true,
        dataForm: {
        },
        dialogVisible: false,
        dialogImageUrl: '',
        dataList: [],
        dataRule: {
        }
      }
    },
    methods: {
      init (id) {
        this.clickFlag = true
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          // if (this.dataForm.id) {
          //   this.$http({
          //     url: this.$http.adornUrl(`/transresources/trdriver/info/${this.dataForm.id}`),
          //     method: 'get',
          //     params: this.$http.adornParams()
          //   }).then(({data}) => {
          //     if (data && data.code === 0) {
          //     }
          //   })
          // }
        })
      }
    }
  }
</script>
