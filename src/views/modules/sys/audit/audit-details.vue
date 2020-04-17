<template>
  <el-dialog
    title="详情"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="流程名称：">
            <span style="width: 200px; display: block">
              {{dataForm.name}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模块：">
            <span style="width: 200px; display: block">
              {{dataForm.moduleName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述：">
            <span style="width: 90%; display: block">
              {{dataForm.description}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用：" size="mini" prop="status">
            <span style="width: 200px; display: block">
              {{dataForm.validFlag ? '启用' : '禁用'}}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="流程步骤：">
        <template v-for="(item,index) in dataForm.auditDetailEntityList">
          <el-row>
            <el-col :span="3">
                <span style="display: inline-block;width: 100%">
                  {{item.stepName}}：
                </span>
            </el-col>
            <el-col :span="2">
              <el-tag>
                {{item.objType === 'ROLE' ? '角色' : '用户'}}
              </el-tag>
            </el-col>
            <el-col :span="8">
              <el-tooltip class="item" effect="dark" :disabled="item.objName === ''" :content="item.objName" placement="top">
                <el-input size="mini" v-model="item.objName" placeholder="点击右侧按钮选择" readonly></el-input>
              </el-tooltip>
            </el-col>
          </el-row>
        </template>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
      </span>
  </el-dialog>
</template>
<script>
  export default {
    data () {
      return {
        dataForm: {},
        visible: false
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.$http({
          url: this.$http.adornUrl(`/sys/audit/info/${id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm = data.sysAuditEntity
          }
          this.dataListLoading = false
        })
      }
    }
  }
</script>
