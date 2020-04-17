<template>
  <el-dialog
    title="修改密码"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="登录帐号" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="新用户名" prop="newUserName">
        <el-input v-model="dataForm.newUserName" placeholder="推荐修改默认用户名(可不填写)" maxlength="16"></el-input>
      </el-form-item>
      <el-input  style="position: fixed;bottom: 10000px"></el-input>
      <el-input type="password" style="position: fixed;bottom: 10000px"></el-input>
      <el-form-item label="原始密码" prop="password">
        <el-input v-model="dataForm.password" type="password" placeholder="原始密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="dataForm.newPassword" type="password" placeholder="新密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="comfirmPassword">
        <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      let validateComfirmPassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('确认密码不能为空'))
        } else if (this.dataForm.newPassword !== value) {
          callback(new Error('确认密码与密码输入不一致'))
        } else {
          callback()
        }
      }
      let verifyUserName = (rule, value, callback) => {
        this.verifyUserName()
        if (value && value === '') {
          callback()
        }
        setTimeout(() => {
          if (this.dataStatus) {
            callback()
          } else {
            callback(new Error('用户名已存在'))
          }
        }, 1000)
      }
      return {
        visible: false,
        clickFlag: true,
        roleList: [],
        getFlag: false,
        dataForm: {
          userName: '',
          newUserName: '',
          password: '',
          newPassword: '',
          comfirmPassword: ''
        },
        dataStatus: true,
        dataRule: {
          userName: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          newUserName: [
            {validator: verifyUserName, trigger: 'blur'}
          ],
          password: [
            {required: true, message: '原始密码不能为空', trigger: 'blur'}
          ],
          comfirmPassword: [
            {required: true, message: '确认密码不能为空', trigger: 'blur'},
            {validator: validateComfirmPassword, trigger: 'blur'}
          ],
          newPassword: [
            {required: true, message: '新密码不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (userName) {
        this.visible = true
        this.clickFlag = true
        this.dataForm.newUserName = ''
        this.dataForm.password = ''
        this.dataForm.newPassword = ''
        this.dataForm.comfirmPassword = ''
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.dataForm.userName = userName
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
            setTimeout(() => {
              this.clickFlag = true
            }, 1500)
            this.$http({
              url: this.$http.adornUrl('/sys/user/updatePassword'),
              method: 'post',
              data: this.$http.adornData({
                'userName': this.dataForm.userName,
                'newUserName': this.dataForm.newUserName,
                'password': this.dataForm.password,
                'newPassword': this.dataForm.newPassword
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
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 判断用户名是否存在
      verifyUserName () {
        this.$http({
          url: this.$http.adornUrl('/sys/user/verify_username'),
          method: 'post',
          data: this.$http.adornData({
            'newUserName': this.dataForm.newUserName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataStatus = true
          } else {
            this.dataStatus = false
          }
        })
      }
    }
  }
</script>
