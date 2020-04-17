<template>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="110px">
    <el-form-item label-width="0">
      <el-tag>基本信息</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item label="承运商" prop="carrierId">
          <xkl-select style="width: 100%" v-model="dataForm.carrierId" @change="selectCarriageArea" keyType="carrierId" labelType="carrierName" linkage="/transresources/trcarrier/findList" placeholder="请选择或者输入查找"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="承运区域" prop="carriageAreaId">
          <el-select class="removeArrow" style="width: 100%" v-model="dataForm.carriageAreaId" filterable @change="getcarriageAreaName" clearable placeholder="请选择或者输入查找">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
<!--          <xkl-select style="width: 100%" v-model="dataForm.carriageAreaId" @getLabel="getcarriageAreaName" keyType="id" labelType="shortname" linkage="/sys/trcarrierarea/list " placeholder="承运商名称"></xkl-select>-->
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="始发地" prop="startCityId">
          <xkl-select style="width: 100%" v-model="dataForm.startCityId" @getLabel="getstartCityName" keyType="id" labelType="name" linkage="/sys/sysregion/citySelect " placeholder="请选择或者输入查找"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="目的地省" prop="endProvinceId">
          <xkl-select style="width: 100%" v-model="dataForm.endProvinceId" @getLabel="getendProvinceName" keyType="id" labelType="name" levelNumber1="1" linkage="/sys/sysregion/provinceSelect " placeholder="请选择或者输入查找"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="目的地城市" prop="endCityId">
          <xkl-select style="width: 100%" v-model="dataForm.endCityId" @getLabel="getendCityName" keyType="id" labelType="name" levelNumber2="2" :selectId="dataForm.endProvinceId" linkage="/sys/sysregion/regionList " placeholder="请选择或者输入查找"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="优选顺序" prop="goodSort">
<!--          <xkl-select style="width: 100%" v-model="dataForm.carrierId" keyType="carrierId" labelType="carrierName" linkage="/transresources/trcarrier/findList " placeholder="承运商名称"></xkl-select>-->
          <el-input style="width: 100%" v-model="dataForm.goodSort" placeholder="请输入"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="所属项目" >
          <el-input style="width: 100%" v-model="dataForm.belongProject" placeholder="请输入" maxlength="60" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否运作线路" prop="isUsedLine">
          <el-radio-group v-model="dataForm.isUsedLine" @change="changeIsGoodLineFlag">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否优势线路" prop="isGoodLine">
          <el-radio-group v-model="dataForm.isGoodLine" :disabled="isGoodLineFlag">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注信息">
          <el-input v-model="dataForm.remark" type="textarea" rows="4" maxlength="100" placeholder="多行输入"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label-width="0">
      <el-tag>运输产品</el-tag>
    </el-form-item>
    <el-row>
      <el-col style="text-align: right">
        <el-form-item style="margin-bottom: 5px;margin-right: 30px">
          <el-button type="success" @click="getProductList('line')" size="mini">
            <icon-svg name="选择" style="vertical-align: middle"></icon-svg>
            选择</el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="!productInfo.id">
      <el-col>
        <div style="height: 100px;line-height: 100px;text-align: center;font-size: 20px;color: #CCCCCC">暂无运输产品！</div>
      </el-col>
    </el-row>
    <el-row v-else>
      <el-col :span="6" key="item" style="margin-bottom: 20px">
        <div style="width: 90%;margin: 0 auto">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span style="color: #ffffff;
              display: inline-block;
              width: 80%;
              font-size: 20px;
              font-weight: bold;
              overflow:hidden;
             text-overflow:ellipsis;
             white-space:nowrap;">{{productInfo.prdName}}</span>
              <el-button style="float: right; padding: 3px 0;color: #ffffff" type="text" icon="el-icon-delete" @click="deleteProduct"></el-button>
            </div>
            <div class="text item">{{'运输方式：' + productInfo.tpModeName }}</div>
            <div class="text item">{{'配载方式：' + productInfo.loadingModeName }}</div>
            <div class="text item">{{'温控类型：' + productInfo.tempModeName }}</div>
            <el-button style="padding: 3px 0" type="text" @click="getDrawerInfo(productInfo.id)">详 情</el-button>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <product-drawer v-if="drawerVisible" ref="productDrawer"></product-drawer>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-form-item>
          <el-button @click="$router.push({name: 'trans-resources-carrier-line/carrier-line'})">关闭</el-button>
          <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  import ProductDrawer from '../product/product-drawer'
  export default {
    data () {
      let verifyChar = (rule, value, callback) => {
        let patrn = /^(\w){0,30}$/;
        if (!patrn.exec(value)) {
          callback(new Error('只能输入字母、数字、下划线'))
        }
        callback()
      }
      let verifyNumber = (rule, value, callback) => {
        let patrn = /^[1-9][0-9]{0,4}$/;
        if (!patrn.exec(value)) {
          callback(new Error('只能输入不超过5位的正整数'))
        }
        callback()
      }
      // let verifyPrice = (rule, value, callback) => {
      //   if (value) {
      //     let patrn = /^(([1-9][0-9]{1,6})|([0-9]{1}))(\.[0-9]{1,3})?$/;
      //     if (!patrn.exec(value)) {
      //       callback(new Error('只能输入最大7位整数，最大3位小数'))
      //     }
      //   }
      //   callback()
      // }

      // let verifyPositiveNumber = (rule, value, callback) => {
      //   if (!value) {
      //     callback()
      //   }
      //   if (isNaN(value) || value < 0) {
      //     callback(new Error('请输入大于0的数字'))
      //   }
      //   callback()
      // }
      return {
        visible: false,
        drawerVisible: false,
        clickFlag: true,
        linkage: '1',
        dataForm: {
          id: 0,
          carrierId: '',
          carriageAreaId: '',
          startCityId: '',
          endProvinceId: '',
          endCityId: '',
          remark: '',
          goodSort: '',
          isGoodLine: 1,
          isUsedLine: 0,
          belongProject: '',
          productId: ''
        },
        isGoodLineFlag: true,
        options: [],
        carriageAreaName: '',
        startCityName: '',
        endProvinceName: '',
        endCityName: '',
        signDepData: [],
        productInfoList: [],
        productInfo: {
          id: '',
          prdName: '',
          tpModeName: '',
          loadingModeName: '',
          tempModeName: ''
        },
        loadUrl: '/transresources/trcontract/upload',
        downloadUrl: '/transresources/trcontract/download',
        dataRule: {
          carrierId: [
            { required: true, message: '请选择承运商', trigger: 'change' },
            { validator: verifyChar, trigger: 'blur' }
          ],
          startCityId: [
            { required: true, message: '请选择始发地', trigger: 'change' },
            { validator: verifyChar, trigger: 'blur' }
          ],
          endCityId: [
            { required: true, message: '请选择目的地市', trigger: 'change' },
            { validator: verifyChar, trigger: 'blur' }
          ],
          goodSort: [
            { required: true, message: '请输入优先顺序', trigger: 'blur' },
            { validator: verifyNumber, trigger: 'blur' }
          ],
          isGoodLine: [
            { required: true, message: '请选择优势状态', trigger: 'change' }
          ],
          isUsedLine: [
            { required: true, message: '请选择运作状态', trigger: 'change' }
          ],
          carriageAreaId: [
            { required: true, message: '请选择承运区域', trigger: 'change' },
            { validator: verifyChar, trigger: 'blur' }
          ],
          endProvinceId: [
            { required: true, message: '请选择目的地省', trigger: 'change' },
            { validator: verifyChar, trigger: 'blur' }
          ]
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
    watch: {
      '$route.params' (newVal) {
        if (this.$route.params.length) {
          this.productInfo = {}
          this.dataForm.productId = ''
          this.productInfoList = this.$route.params
          this.productInfo = this.productInfoList[0]
          this.dataForm.productId = this.productInfo.id
        }
      },
      'dataForm.endProvinceId' (newVal, oldVal) {
        if (oldVal) {
          this.dataForm.endCityId = ''
        }
      }
    },
    components: {
      ProductDrawer
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.clickFlag = true
        this.dataForm.id = this.$route.query.id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.isDisabled = true
            this.$http({
              url: this.$http.adornUrl(`/transresources/trcarrierline/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.carrierId = data.trCarrierLine.carrierId
                if (this.dataForm.carrierId !== '') {
                  this.selectCarriageArea(this.dataForm.carrierId)
                }
                this.dataForm.carriageAreaId = parseInt(data.trCarrierLine.carriageAreaId) ? parseInt(data.trCarrierLine.carriageAreaId) : ''
                this.dataForm.startCityId = parseInt(data.trCarrierLine.startCityId) ? parseInt(data.trCarrierLine.startCityId) : ''
                this.dataForm.endProvinceId = parseInt(data.trCarrierLine.endProvinceId)
                this.dataForm.endCityId = parseInt(data.trCarrierLine.endCityId)
                this.dataForm.goodSort = data.trCarrierLine.goodSort
                this.dataForm.isGoodLine = data.trCarrierLine.isGoodLine
                this.dataForm.isUsedLine = data.trCarrierLine.isUsedLine
                this.dataForm.belongProject = data.trCarrierLine.belongProject
                this.dataForm.remark = data.trCarrierLine.remark
                this.carriageAreaName = data.trCarrierLine.carriageAreaName
                this.startCityName = data.trCarrierLine.startCityName
                this.endProvinceName = data.trCarrierLine.endProvinceName
                this.endCityName = data.trCarrierLine.endCityName
                this.dataForm.productId = data.trCarrierLine.productId
                if (this.dataForm.productId !== '') {
                  this.selectProduct(this.dataForm.productId)
                }
                if (this.dataForm.isUsedLine === 1) {
                  this.isGoodLineFlag = false
                }
              }
            })
          } else {
            this.isDisabled = false
            this.dataForm.attachmentUrl = ''
          }
        })
      },
      selectProduct (id) {
        this.$http({
          url: this.$http.adornUrl(`/transresources/trproduct/info/${id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.productInfo = data.tTrProduct
          } else {
            this.productInfo = {}
          }
        })
      },
      selectCarriageArea () {
        this.dataForm.carriageAreaId = ''
        this.options = []
        this.$http({
          url: this.$http.adornUrl(`/transresources/trcarrierarea/area/${this.dataForm.carrierId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.options = data.areaList
          }
        })
      },
      getcarriageAreaName () {
        this.options.forEach(item => {
          if (item.id === this.dataForm.carriageAreaId) {
            this.carriageAreaName = item.name
          }
        })
      },
      getstartCityName (name) {
        this.startCityName = name
      },
      getendProvinceName (name) {
        this.endProvinceName = name
      },
      getendCityName (name) {
        this.endCityName = name
      },
      changeIsGoodLineFlag () {
        if (this.dataForm.isUsedLine === 1) {
          this.isGoodLineFlag = false
        } else {
          this.dataForm.isGoodLine = 1
          this.isGoodLineFlag = true
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.dataForm.productId === '') {
              this.$message({
                type: 'warning',
                message: '请选择服务产品！'
              })
              return
            }
            if (!this.clickFlag) {
              return;
            }
            this.clickFlag = false
            this.$http({
              url: this.$http.adornUrl(`/transresources/trcarrierline/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'carrierId': this.dataForm.carrierId,
                'carriageAreaId': this.dataForm.carriageAreaId,
                'carriageAreaName': this.carriageAreaName,
                'startCityId': this.dataForm.startCityId,
                'startCityName': this.startCityName,
                'endProvinceId': this.dataForm.endProvinceId,
                'endProvinceName': this.endProvinceName,
                'endCityId': this.dataForm.endCityId,
                'endCityName': this.endCityName,
                'belongProject': this.dataForm.belongProject,
                'goodSort': this.dataForm.goodSort,
                'isGoodLine': this.dataForm.isGoodLine,
                'isUsedLine': this.dataForm.isUsedLine,
                'remark': this.dataForm.remark,
                'productId': this.dataForm.productId
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.$router.push({name: 'trans-resources-carrier-line/carrier-line'})
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
      getDrawerInfo (id) {
        this.drawerVisible = true
        this.$nextTick(() => {
          this.$refs.productDrawer.init(id)
        })
      },
      getProductList (type) {
        this.$router.push({
          name: 'product-list',
          params: {
            type: type,
            isSelected: this.productInfoList
          }
        })
      },
      deleteProduct () {
        this.productInfoList.splice(0, 1)
        this.productInfo = {}
        this.dataForm.productId = ''
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/.el-checkbox-button {
    .el-checkbox-button__inner{
      min-width: 280px!important;
      border-color: #ffffff!important;
      padding: 0;
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
  .box-card{
    /deep/.el-card__header {
      background-color: #3e8ef76b;
    }
  }
  .removeArrow{
    /deep/.el-input__suffix {
      display: none;
    }
  }

</style>
