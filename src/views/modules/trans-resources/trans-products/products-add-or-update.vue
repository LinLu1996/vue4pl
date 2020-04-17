<template>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
    <el-form-item label-width="0">
      <el-tag>基本信息</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="产品编号" prop="prdNo">
          <el-input v-model="dataForm.prdNo" maxlength="30" clearable placeholder="产品编号"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="产品名称" prop="prdName">
          <el-input v-model="dataForm.prdName" maxlength="20" clearable placeholder="产品名称"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="运输方式" prop="tpMode">
          <xkl-select style="width: 100%" v-model="dataForm.tpMode" select-type="TRANSPORT_TYPE" placeholder="运输方式"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="配载方式" prop="loadingMode">
          <xkl-select style="width: 100%" v-model="dataForm.loadingMode" keyType="shipmentKey" labelType="shipmentName" linkage="/transresources/tbasicshipment/list"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="温控类型" prop="tempMode">
          <xkl-select style="width: 100%" v-model="dataForm.tempMode" select-type="TEMP_MODE"  placeholder="温控类型"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="温区"  prop="warmArea">
          <xkl-select style="width: 100%" v-model="dataForm.warmArea" select-type="TEMPERATURE" :multiple="true" placeholder="请选择"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label=是否启用 prop="isEnabled">
          <el-radio-group v-model="dataForm.isEnabled">
            <el-radio :label=0>启用</el-radio>
            <el-radio :label=1>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注">
          <el-input v-model="dataForm.remark" type="textarea" rows="4" maxlength="160"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label-width="0">
      <el-tag>质量标准</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="24">
        <el-form-item label="标准内容" prop="qualityStandard">
          <el-input v-model="dataForm.qualityStandard" type="textarea" rows="3" maxlength="160"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="附件" prop="attachments">
          <xkl-upload v-model="dataForm.attachments" :id="uploadConfig.id" :config="uploadConfig"></xkl-upload>
        </el-form-item>
      </el-col>
    </el-row>
    <service-standard :templateData="templateData" :standardId="standardId" ref="service1Form" @getStandardId="getStandardId"></service-standard>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-form-item>
          <el-button @click="$router.go(-1)">关闭</el-button>
          <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  import serviceStandard from './service-standard'
  export default {
    data () {
      // let verifyChar = (rule, value, callback) => {
      //   let patrn = /^(\w){0,30}$/;
      //   if (!patrn.exec(value)) {
      //     callback(new Error('只能输入字母、数字、下划线'))
      //   }
      //   callback()
      // }
      // let verifyNumberChar = (rule, value, callback) => {
      //   let patrn = /^(\w){0,30}$/;
      //   if (!patrn.exec(value)) {
      //     callback(new Error('只能输入字母、数字、下划线'))
      //   }
      //   callback()
      // }
      return {
        visible: false,
        drawerVisible: false,
        templateShow: false,
        clickFlag: true,
        dataListLoading: false,
        standardLength: 0,
        dataList: [],
        standardId: '',
        linkage: '1',
        dataForm: {
          id: 0,
          prdNo: '',
          prdName: '',
          tpMode: '',
          warmArea: '',
          loadingMode: '',
          tempMode: '',
          isEnabled: 1,
          remark: '',
          qualityStandard: '',
          pathName: '',
          attachments: []
        },
        signDepData: [],
        templateData: [],
        dataRule: {
          prdNo: [
            {required: true, message: '请填写产品编号', trigger: 'blur'}
            // {validator: verifyNumberChar}
          ],
          prdName: [
            { required: true, message: '请填写产品名称', trigger: 'blur' }
          ],
          tpMode: [
            { required: true, message: '请选择运输方式', trigger: 'change' }
          ],
          loadingMode: [
            { required: true, message: '请选择配载方式', trigger: 'change' }
          ],
          tempMode: [
            { required: true, message: '请选择温控类型', trigger: 'change' }
          ]
        },
        uploadConfig: {
          fileListType: 'picture-card', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/transresources/trcontract/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: false, // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
          id: ''
        },
        fileList: [],
        levelDate: '',
        pickerOptions: {
          disabledDate (value) {
            if (Date.now() >= value) {
              return true
            }
            return false
          }
        },
        isDisabled: false
      }
    },
    components: {
      serviceStandard
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.clickFlag = true
        this.dataForm.id = this.$route.query.id || null
        this.uploadConfig.id = this.dataForm.id
        this.visible = true
        if (JSON.stringify(this.$route.params) !== '{}') {
          this.templateData = this.$route.params
        }
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.isDisabled = true
            this.$http({
              url: this.$http.adornUrl(`/transresources/trproduct/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.prdNo = data.tTrProduct.prdNo
                this.dataForm.prdName = data.tTrProduct.prdName
                this.dataForm.tpMode = data.tTrProduct.tpMode
                this.dataForm.loadingMode = data.tTrProduct.loadingMode
                this.dataForm.tempMode = data.tTrProduct.tempMode
                this.dataForm.isEnabled = data.tTrProduct.isEnabled
                this.dataForm.remark = data.tTrProduct.remark
                this.dataForm.qualityStandard = data.tTrProduct.qualityStandard
                this.dataForm.pathName = data.tTrProduct.pathName
                this.dataForm.warmArea = data.tTrProduct.warmArea ? data.tTrProduct.warmArea.split(',') : []
                this.dataForm.attachments = data.tTrProduct.attachmentList ? data.tTrProduct.attachmentList : []
                this.standardLength = data.tTrProduct.count
                this.standardId = data.tTrProduct.serviceStandard
                this.templateData = data.tTrProduct.kpiTemplateRelationEntityList.length ? data.tTrProduct.kpiTemplateRelationEntityList : []
              }
            })
          } else {
            this.isDisabled = false
          }
        })
      },
      getStandardId (standardId, modelList, standardLength) {
        this.standardId = standardId
        this.templateData = modelList
        this.standardLength = standardLength
      },
      // 表单提交
      dataFormSubmit () {
        if (this.$store.state.upload.status) {
          this.$message({
            type: 'warning',
            message: '文件尚未上传完成'
          })
          return false
        }
        let valids = []
        if (this.$refs['service1Form'].$refs['service1Form0']) {
          for (let i = 0; i < this.standardLength; i++) {
            this.$refs['service1Form'].$refs['service1Form' + i].validate((valid) => {
              valids.push(valid)
            })
            this.$refs['service1Form'].$refs['service2Form' + i].validate((valid) => {
              valids.push(valid)
            })
          }
          if (valids.indexOf(false) < 0) {
            this.handleSubmit()
          }
        } else {
          this.handleSubmit()
        }
      },
      handleSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.clickFlag) {
              return;
            }
            this.clickFlag = false
            setTimeout(() => { this.clickFlag = true }, 1000)
            this.$http({
              url: this.$http.adornUrl(`/transresources/trproduct/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.uploadConfig.id,
                'prdNo': this.dataForm.prdNo,
                'prdName': this.dataForm.prdName,
                'tpMode': this.dataForm.tpMode,
                'loadingMode': this.dataForm.loadingMode,
                'tempMode': this.dataForm.tempMode,
                'isEnabled': this.dataForm.isEnabled,
                'remark': this.dataForm.remark,
                'qualityStandard': this.dataForm.qualityStandard,
                'attachments': this.dataForm.attachments,
                'serviceStandard': this.standardId,
                'kpiTemplateRelationEntityList': this.templateData,
                'warmArea': this.dataForm.warmArea.join(',')
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.$router.push({name: 'trans-resources-trans-products/products'})
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
      getSelectDate (val) {
        if (val) {
          let levelDate = (new Date(val) - Date.now()) / 86400000
          levelDate = Math.ceil(levelDate)
          this.levelDate = levelDate
          this.$message({
            type: 'warning',
            // message: '证书还有' + levelDate + '天过期',
            message: levelDate > 0 ? `合同还有${levelDate}天过期` : `合同已过期${-levelDate}天`
          })
        } else {
          this.levelDate = ''
        }
      },
      closeForm () {
        this.visible = false
        this.$refs['attachment'].init()
      },
      getDrawerInfo () {
        this.drawerVisible = true
        this.$nextTick(() => {
          this.$refs.productDrawer.init()
        })
      },
      getStandard () {
        this.templateShow = true
        this.$nextTick(() => {
          this.$refs.templateShow.init()
        })
      },
      handlePrdNo (event) {
        this.$http({
          url: this.$http.adornUrl(`/transresources/trproduct/byProductNo/${event.target.value}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code !== 0) {
            this.$message(data.msg)
            this.dataForm.prdNo = ''
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/.el-checkbox-button {
    .el-checkbox-button__inner{
      min-width: 280px!important;
      border-color: #ffffff!important;
      padding: 1px;
    }
  }
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
    display: block;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>
