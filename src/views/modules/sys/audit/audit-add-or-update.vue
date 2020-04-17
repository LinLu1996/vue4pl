<template>
  <div>
    <el-dialog
      :title="!dataForm.id ? '新增' : '编辑'"
      :close-on-click-modal="false"
      :visible.sync="visible">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
        <el-form-item label="流程名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="流程名称" maxlength="16" clearable></el-input>
        </el-form-item>
        <el-form-item label="模块" prop="module">
          <xkl-select style="width: 100%" v-model="dataForm.module" select-type="AUDIT_MODULE" placeholder="模块"></xkl-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            maxlength="166"
            v-model="dataForm.description">
          </el-input>
        </el-form-item>
        <el-form-item label="是否启用" size="mini" prop="validFlag">
          <el-radio-group v-model="dataForm.validFlag">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="流程步骤" prop="auditDetailEntityList">
          <el-button type="primary" icon="el-icon-circle-plus" size="mini" @click="addOrDelStep(1)" style="background: #3698ce;color: #ffffff">添加</el-button>
          <el-button type="danger" icon="el-icon-remove" size="mini" @click="addOrDelStep()">删除</el-button>
          <template v-for="(item,index) in dataForm.auditDetailEntityList" style="margin-bottom: 10px">
            <el-row>
              <el-col :span="3">
                <span style="display: inline-block;width: 100%">
                  {{item.stepName}}：
                </span>
              </el-col>
              <el-col :span="6">
                <el-radio-group v-model="item.objType" size="mini" @change="item.objName = null, item.objPkList = []">
                  <<el-radio-button label="ROLE">角色</el-radio-button>>
                  <<el-radio-button label="USER">用户</el-radio-button>>
                </el-radio-group>
              </el-col>
              <el-col :span="8">
                <el-tooltip class="item" effect="dark" :disabled="item.objName === ''" :content="item.objName" placement="top">
                  <el-input size="mini" v-model="item.objName" placeholder="点击右侧按钮选择" readonly></el-input>
                </el-tooltip>
              </el-col>
              <el-col :span="2">
                <el-button type="success" size="mini" @click="openModel(item.objType,index)" style="margin: 0 20px">
                  <icon-svg name="选择" style="vertical-align: middle"></icon-svg>
                  选择</el-button>
              </el-col>
            </el-row>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
    <role-user v-if="roleUserVisible" ref="roleUser" @configHandle="getRoleUserData"></role-user>
  </div>
</template>
<script>
  import RoleUser from './audit-role-user'
  export default {
    data () {
      return {
        objFlag: false,
        visible: false,
        roleUserVisible: false,
        currentIndex: '',
        dataForm: {
          id: '',
          name: '',
          module: '',
          validFlag: 1,
          description: '',
          auditDetailEntityList: [
            {
              stepName: '发起者',
              objType: 'ROLE',
              step: '0',
              objPkList: [],
              objName: ''
            }
          ]
        },
        clickFlag: true,
        dataRule: {
          name: [
            { required: true, message: '流程名称不能为空', trigger: 'blur' }
          ],
          module: [
            { required: true, message: '模块不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      RoleUser
    },
    watch: {
    },
    methods: {
      init (id) {
        this.objFlag = false
        this.clickFlag = true
        this.visible = true
        this.dataForm.id = id || ''
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.dataForm.auditDetailEntityList[0].objName = ''
          this.$http({
            url: this.$http.adornUrl('/sys/audit/getUserRoleList'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(() => {
            if (this.dataForm.id) {
              this.$http({
                url: this.$http.adornUrl(`/sys/audit/info/${this.dataForm.id}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.dataForm = data.sysAuditEntity
                }
              })
            }
          })
        })
      },
      openModel (obj, index) {
        this.currentIndex = index
        this.roleUserVisible = true
        this.$nextTick(() => {
          this.$refs.roleUser.init(obj)
        })
      },
      getRoleUserData (val) {
        let index = this.currentIndex;
        this.dataForm.auditDetailEntityList[index].objPkList = val.map(res => {
          return res.key
        })
        this.dataForm.auditDetailEntityList[index].objName = val.map(res => {
          return res.value
        }).join('、')
        this.roleUserVisible = false
      },
      addOrDelStep (type) {
        if (type === 1) {
          if (this.dataForm.auditDetailEntityList.length > 50) {
            this.$message.warning('超出最大个数50');
            return;
          }
          this.dataForm.auditDetailEntityList.push(
            {
              stepName: 'Step ' + this.dataForm.auditDetailEntityList.length,
              objType: 'ROLE',
              step: String(this.dataForm.auditDetailEntityList.length),
              objPkList: [],
              objName: ''
            }
          )
        } else {
          if (this.dataForm.auditDetailEntityList.length <= 1) {
            this.$message.warning('至少保留一步');
            return;
          }
          this.dataForm.auditDetailEntityList.pop();
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.objFlag = false
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.dataForm.auditDetailEntityList.length <= 1) {
              this.$message.error('必须添加流程步骤-Step1');
              return;
            }
            this.dataForm.auditDetailEntityList.map(item => {
              if (!item.objName) {
                this.objFlag = true
              }
            })
            if (this.objFlag) {
              this.$message.error('请选择用户和角色');
              return;
            }
            if (!this.clickFlag) {
              return;
            }
            this.clickFlag = false
            this.$http({
              url: this.$http.adornUrl(`/sys/audit/save`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id,
                'name': this.dataForm.name,
                'module': this.dataForm.module,
                'validFlag': this.dataForm.validFlag,
                'description': this.dataForm.description,
                'auditDetailEntityList': this.dataForm.auditDetailEntityList
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.clickFlag = true
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
