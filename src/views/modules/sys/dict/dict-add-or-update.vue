<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="类型" prop="type">
        <el-input v-model="dataForm.type" maxlength="20" placeholder="字典类型名称"></el-input>
      </el-form-item>
      <el-form-item label="类型名称" prop="typeName">
        <el-input v-model="dataForm.typeName" maxlength="66" placeholder="字典类型名称"></el-input>
      </el-form-item>
      <el-form-item label="键值" prop="dicKey">
        <el-input v-model="dataForm.dicKey" maxlength="30" placeholder="键值"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="dicValue">
        <el-input v-model="dataForm.dicValue" maxlength="66" placeholder="内容"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="dicSort">
        <el-input v-model.number="dataForm.dicSort" maxlength="8" placeholder="排序"></el-input>
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
      var validateType = (rule, value, callback) => {
        if (value.search(/[^\w_]/g) > -1 && value !== '' && value !== null) {
          callback(new Error('只能输入数字、字母、下划线'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        clickFlag: true,
        dataForm: {
          id: '',
          type: '',
          typeName: '',
          dicKey: '',
          dicValue: '',
          dicSort: ''
          // deleted: ''
        },
        dataRule: {
          id: [
            { required: true, message: '参数名不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '字典类型不能为空', trigger: 'blur' },
            { validator: validateType, trigger: 'blur' }
          ],
          typeName: [
            { required: true, message: '字典类型名不能为空', trigger: 'blur' }
          ],
          dicKey: [
            { required: true, message: '键值不能为空', trigger: 'blur' },
            { validator: validateType, trigger: 'blur' }
          ],
          dicValue: [
            { required: true, message: '内容不能为空', trigger: 'blur' }
          ],
          dicSort: [
            { required: true, message: '排序不能为空', trigger: 'blur' },
            { type: 'number', message: '排序只能为数字', trigger: 'blur' }
          ],
          deleted: [
            { required: true, message: '请选择是否删除', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.clickFlag = true
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/dictionary/findById/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.type = data.sysDictionaryEntity.type
                this.dataForm.typeName = data.sysDictionaryEntity.typeName
                this.dataForm.dicKey = data.sysDictionaryEntity.dicKey
                this.dataForm.dicValue = data.sysDictionaryEntity.dicValue
                this.dataForm.dicSort = data.sysDictionaryEntity.dicSort
                // this.dataForm.deleted = data.sysDictionaryEntity.deleted.toString()
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
              url: this.$http.adornUrl(`/sys/dictionary/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'type': this.dataForm.type,
                'typeName': this.dataForm.typeName,
                'dicKey': this.dataForm.dicKey,
                'dicValue': this.dataForm.dicValue,
                'dicSort': this.dataForm.dicSort
                // 'deleted': parseInt(this.dataForm.deleted)
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: this.dataForm.id ? '编辑成功' : '新增成功',
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
