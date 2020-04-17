<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="帐号名称" prop="userName">
            <el-input v-model="dataForm.userName" placeholder="帐号名称" maxlength="16" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="dataForm.realName" placeholder="真实姓名" maxlength="10" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-input  style="position: fixed;bottom: 10000px"></el-input>
        <el-input type="password" style="position: fixed;bottom: 10000px"></el-input>
        <el-col :span="12">
          <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">
            <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email" >
            <el-input v-model="dataForm.email" placeholder="邮箱" maxlength="25" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="dataForm.mobile" placeholder="手机号" maxlength="11" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户类型" prop="userType" v-if="organ ? organ : !organ">
            <xkl-select style="width: 100%" v-model="dataForm.userType" :disabled="isDisabled" select-type="USER_TYPE" placeholder="用户类型"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属组织" prop="belongOrganization" v-if="organ">
            <xkl-select style="width: 100%" v-model="dataForm.belongOrganization" :disabled="isDisabled" :labelType="labelType" :linkage="linkage" placeholder="所属组织"></xkl-select>
          </el-form-item>
          <el-form-item  prop="userTypeId" style="position: fixed;bottom: 10000px" >
            <el-input v-model="dataForm.userTypeId"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
<!--      v-if="roleIdL"-->
      <el-form-item label="角色" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="是否启用" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">启用</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isEmail, isMobile } from '@/utils/validate'
  export default {
    data () {
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value) && value !== '' && value !== null) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      }
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value) && value !== '' && value !== null) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      var verifyUserName = async (rule, value, callback) => {
        let res = await this.verifyUserName()
        if (!res) {
          callback(new Error('账号名称已存在'))
        }
        callback()
      }
      return {
        visible: false,
        roleList: [],
        linkage: '',
        labelType: '',
        organ: true,
        userT: true,
        roleIdL: true,
        isDisabled: false,
        dataForm: {
          id: '',
          realName: '',
          userName: '',
          password: '',
          email: '',
          mobile: '',
          roleIdList: [],
          status: 1,
          createBy: '',
          userType: '',
          userTypeId: '',
          belongOrganization: ''
        },
        getFlag: false,
        dataStatus: true,
        clickFlag: true,
        dataRule: {
          userName: [
            { required: true, message: '账号名称不能为空', trigger: 'blur' },
            { validator: verifyUserName, trigger: 'blur' }
          ],
          realName: [
            { required: true, message: '真实姓名不能为空', trigger: 'blur' }
          ],
          userType: [
            { required: true, message: '用户类型不能为空', trigger: 'change' }
          ],
          belongOrganization: [
            { required: true, message: '所属组织不能为空', trigger: 'change' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ],
          mobile: [
            { validator: validateMobile, trigger: 'blur' }
          ]
        },
        originalName: ''
      }
    },
    watch: {
      'dataForm.userType' (newVal) {
        if (newVal !== '') {
          if (newVal === 'PLATFORM') {
            this.linkage = ''
            this.organ = false
            this.roleIdL = false
            // this.dataForm.roleIdList = []
          } else {
            this.organ = true
            this.roleIdL = true
          }
          if (newVal === 'CARRIER') {
            this.labelType = 'carrierName'
            this.linkage = '/transresources/trcarrier/list'
          }
          if (newVal === 'CONSIGNOR') {
            this.labelType = 'ownerName'
            this.linkage = '/transresources/ttrconsignor/noPowerList'
          }
          if (newVal === 'OPERATE') {
            this.labelType = 'fullName'
            this.linkage = '/sys/toperationcenter/list'
          }
        } else if (newVal === '') {
          this.linkage = ''
        }
        this.dataForm.belongOrganization = ''
      }
    },
    methods: {
      init (id, values) {
        this.clickFlag = true
        this.isDisabled = false
        this.dataForm.id = id
        this.$http({
          url: this.$http.adornUrl('/sys/role/select'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.roleList = data && data.code === 0 ? data.list : []
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            if (values.userType !== 0) {
              this.userT = false
              this.organ = false
              this.roleIdL = true
            } else {
              this.userT = true
              this.organ = true
              this.roleIdL = true
            }
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.isDisabled = true
            this.$http({
              url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.userName = data.user.userName
                this.dataForm.realName = data.user.realName
                this.dataForm.email = data.user.email
                this.dataForm.mobile = data.user.mobile
                this.dataForm.roleIdList = data.user.roleIdList
                this.dataForm.status = data.user.status
                this.dataForm.createBy = data.user.createBy
                this.originalName = data.user.userName
                if (data.user.userType === 'PLATFORM') {
                  this.userT = false
                  this.organ = false
                  this.roleIdL = true
                } else {
                  this.userT = true
                  this.organ = true
                  this.roleIdL = true
                }
                this.dataForm.userType = data.user.userType
                this.dataForm.userTypeId = data.user.userType
                this.$nextTick(() => {
                  this.dataForm.belongOrganization = data.user.belongOrganization
                })
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.clickFlag) {
              return;
            }
            this.clickFlag = false
            this.$http({
              url: this.$http.adornUrl(`/sys/user/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.dataForm.id || undefined,
                'userName': this.dataForm.userName,
                'realName': this.dataForm.realName,
                'password': this.dataForm.password,
                'salt': this.dataForm.salt,
                'email': this.dataForm.email,
                'mobile': this.dataForm.mobile,
                'status': this.dataForm.status,
                'roleIdList': this.dataForm.roleIdList,
                'createBy': this.dataForm.createBy,
                'userType': this.dataForm.userType,
                'userTypeId': this.dataForm.userTypeId,
                'belongOrganization': this.dataForm.belongOrganization
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
      },
      // 判断用户名是否存在
      verifyUserName () {
        let dataStatus = true
        if (this.dataForm.userName === this.originalName) {
          return dataStatus
        }
        return this.$http({
          url: this.$http.adornUrl('/sys/user/verify_username'),
          method: 'post',
          data: this.$http.adornData({
            'newUserName': this.dataForm.userName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            return dataStatus
          } else {
            if (this.getFlag) {
              this.dataStatus = false
            } else {
              this.getFlag = true
              this.dataForm.userName = this.originalName
              this.dataForm.password = ''
            }
          }
        })
      }
    }
  }
</script>
