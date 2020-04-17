<template>
  <div>
    <el-dialog
      title="请选择审核模块"
      :close-on-click-modal="false"
      :visible.sync="visible">
      <el-table
        :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
        :data="dataList"
        border
        style="width: 100%;">
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="流程名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="description"
          header-align="center"
          align="center"
          label="描述"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          fixed="right"
          width="220"
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="approval(scope.row)">
              选用
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
    </span>
    </el-dialog>
    <el-dialog
      :title="'请指定审核人'"
      :close-on-click-modal="false"
      :visible.sync="approvalVisible">
      <el-table
        :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
        :data="userList"
        border
        style="width: 100%;">
        <el-table-column
          prop="userName"
          label="用户"
          align="center">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          fixed="right"
          width="220"
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="createRecord(scope.row)">
              选用
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="approvalVisible = false">取消</el-button>
        <el-button type="primary" @click="createRecord">所有用户</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        approvalVisible: false,
        clickFlag: true,
        dataList: [],
        userList: [],
        invoices: [],
        audit: {}
      }
    },
    methods: {
      init (ids, type, invoices) {
        this.invoices = invoices
        this.clickFlag = true
        this.approvalVisible = false
        this.$nextTick(() => {
          if (ids) {
            this.$http({
              url: this.$http.adornUrl(`/sys/audit/auditRecordList/createRecordByModule`),
              method: 'post',
              data: this.$http.adornData({
                'module': type,
                'srcPks': ids,
                'invoices': this.invoices
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                if (!data.list) {
                  this.$message({
                    message: '不存在可用的审核流程',
                    type: 'error',
                    duration: 2000,
                    onClose: () => {
                      this.visible = false
                      this.$emit('refreshDataList')
                    }
                  })
                }
                if (data.list.length === 0) {
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration: 2000,
                    onClose: () => {
                      this.visible = false
                      this.$emit('refreshDataList')
                    }
                  })
                } else if (data.list && data.list.length === 1) {
                  this.approvalVisible = true
                  this.audit = data.list[0]
                  this.userList = data.list[0].usersInRole
                } else {
                  this.visible = true
                  this.dataList = data.list
                }
              }
            })
          }
        })
      },
      approval (audit) {
        this.$nextTick(() => {
          if (audit.id) {
            this.audit = audit
            this.approvalVisible = true
            this.$http({
              url: this.$http.adornUrl(`/sys/audit/auditRecordList/getFirstLevelUsers`),
              method: 'get',
              params: this.$http.adornParams({
                'auditId': audit.id
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.userList = data.userEntityList
              }
            })
          }
        })
      },
      createRecord (row) {
        this.$nextTick(() => {
          this.approvalVisible = true
          this.$http({
            url: this.$http.adornUrl(`/sys/audit/auditRecordList/createRecord`),
            method: 'post',
            data: this.$http.adornData({
              'userId': row.userId ? row.userId : null,
              'id': this.audit.id,
              'module': this.audit.module,
              'srcPks': this.audit.srcPks,
              'invoices': this.invoices
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.approvalVisible = false
              this.visible = false
              this.$message({
                message: '提交成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            }
          })
        })
      }
    }
  }
</script>
