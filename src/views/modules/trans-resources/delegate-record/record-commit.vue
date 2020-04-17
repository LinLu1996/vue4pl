<template>
  <el-dialog
    title="提交"
    :visible.sync="visible"
    width="70%">
    <el-form label-width="100px">
      <el-tag style="font-size: 18px;margin-bottom: 15px;">开票信息</el-tag>
      <el-row>
        <el-col :span="8">
          <el-form-item label="备案编号：">
            {{dataForm.recordNo}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备案名称：">
            {{dataForm.recordName}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="委托方：">
            {{dataForm.ownerName}}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="适用范围：">
            {{dataForm.supportRange}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-tag style="font-size: 18px;margin-bottom: 15px;">附件</el-tag>
      <el-row>
        <el-col :span="24">
          <el-form-item label="附件" prop="attachments">
            <xkl-upload ref="upload" v-model="dataForm.attachments" :id="uploadConfig.id" :config="uploadConfig"></xkl-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeForm()">关闭</el-button>
      <el-button v-if="clickFlag" type="primary" @click="dataFormSubmit()">确定</el-button>
      <el-button v-else type="primary" :loading="btnLoading">提交中</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    components: {
    },
    data () {
      return {
        visible: false,
        dataForm: {
          id: '',
          recordNo: '',
          recordName: '',
          ownerName: '',
          supportRange: '',
          attachments: []
        },
        list: [],
        radio: false,
        clickFlag: true,
        uploadConfig: {
          fileListType: 'text', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/transresources/trcontract/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: false, // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
          id: '',
          text: '最多上传5个文件，点击文件列表即可下载'
        },
        btnLoading: true
      }
    },
    methods: {
      init (data) {
        this.visible = true
        this.dataForm.id = data.id
        this.uploadConfig.id = this.dataForm.id
        this.dataForm.recordNo = data.recordNo
        this.dataForm.recordName = data.recordName
        this.dataForm.ownerName = data.ownerName
        this.dataForm.supportRange = data.supportRange
        this.dataForm.attachments = data.trAttachmentRelationEntityList
      },
      dataFormSubmit () {
        if (this.$store.state.upload.status) {
          this.$message({
            type: 'warning',
            message: '文件尚未上传完成'
          })
          return false
        }
        if (!this.clickFlag) {
          return;
        }
        this.clickFlag = false
        this.$http({
          url: this.$http.adornUrl(`/transresources/trrecord/commit`),
          method: 'post',
          data: this.$http.adornData({
            'id': this.uploadConfig.id,
            'recordNo': this.dataForm.recordNo,
            'recordStatus': 2,
            'attachments': this.dataForm.attachments
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
            this.clickFlag = true
          } else {
            this.clickFlag = true
            this.$message.error(data.msg)
          }
        })
      },
      closeForm () {
        this.visible = false
        // this.$refs.upload.init('add')
      }
    }
  }
</script>
<style>
</style>

