<template>
  <div>
    <el-dialog
      :title="openType === 'ROLE' ? '角色' : '用户'"
      :close-on-click-modal="false"
      :visible.sync="visible">
      <el-table
        :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
        ref="roleTable"
        :data="sysRoleUserList"
        border
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          type="index"
          width="100"
          align="center"
          label="No.">
        </el-table-column>
        <el-table-column
          prop="value"
          :label="openType === 'ROLE' ? '角色' : '用户'"
          align="center">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="chooseRoleUser()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        openType: '',
        sysRoleUserList: [],
        selectionDataList: []
      }
    },
    methods: {
      init (obj, index) {
        this.openType = obj
        this.visible = true
        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/audit/getUserRoleList'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (this.openType === 'ROLE') {
              this.sysRoleUserList = data && data.code === 0 ? data.UserOrRole.sysRoleList : [];
            } else {
              this.sysRoleUserList = data && data.code === 0 ? data.UserOrRole.sysUserList : []
            }
          })
        })
      },
      handleSelectionChange (val) {
        this.selectionDataList = val
      },
      chooseRoleUser () {
        this.$emit('configHandle', this.selectionDataList)
      }
    }
  }
</script>
