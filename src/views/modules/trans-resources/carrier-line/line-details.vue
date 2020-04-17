<template>
  <el-dialog
    title="详情"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-form-item label-width="0">
        <el-tag>基本信息</el-tag>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="承运商：">
            <span style="width: 100%; display: block">
                {{dataForm.carrierName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="承运区域：">
            <span style="width: 200px; display: block">
                {{dataForm.carriageAreaName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="始发地：">
            <span style="width: 200px; display: block">
                {{dataForm.startCityName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="目的地省：">
            <span style="width: 200px; display: block">
                {{dataForm.endProvinceName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="目的地城市：">
            <span style="width: 200px; display: block">
                {{dataForm.endCityName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="优选顺序：">
            <span style="width: 200px; display: block">
                {{dataForm.goodSort}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否运作线路：">
            <span style="width: 400px; display: inline-block">
                {{dataForm.isUsedLine}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否优势线路：">
            <span style="width: 400px; display: inline-block">
                {{dataForm.isGoodLine}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属项目：">
            <span style="display: inline-block">
                {{dataForm.belongProject}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注信息：">
            <span style="width: 100%; display: inline-block; word-break: break-all">
                {{dataForm.remark}}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label-width="0">
        <el-tag>运输产品</el-tag>
      </el-form-item>
      <el-row v-if="!productInfo.id">
        <el-col>
          <div style="height: 100px;line-height: 100px;text-align: center;font-size: 20px;color: #CCCCCC">无运输产品</div>
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
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeForm()">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import ProductDrawer from '../product/product-drawer'
  export default {
    data () {
      return {
        visible: false,
        drawerVisible: false,
        clickFlag: true,
        linkage: '1',
        dataForm: {
          id: 0,
          carrierName: '',
          // prdName: '',
          carriageAreaName: '',
          startCityName: '',
          endProvinceName: '',
          endCityName: '',
          goodSort: '',
          isGoodLine: '',
          isUsedLine: '',
          belongProject: '',
          remark: ''
        },
        productLists: [],
        productInfoList: [],
        productInfo: {
          id: '',
          prdName: '',
          tpModeName: '',
          loadingModeName: '',
          tempModeName: ''
        },
        fileList: [],
        levelDate: '',
        isDisabled: false
      }
    },
    watch: {
      'dataForm.type' (newVal) {
        if (newVal !== '') {
          this.linkage = newVal === 0 ? '/basic/supplier/noPowerList' : '/sys/operation/noPowerList'
        } else {
          this.linkage = ''
        }
        this.dataForm.owner = ''
      },
      'dataForm.expiryDate' (newVal) {
        this.getSelectDate(newVal)
      },
      '$route.params' (newVal) {
        if (this.$route.params.length) {
          this.productInfo = {}
          this.dataForm.productId = ''
          this.productInfoList = this.$route.params
          this.productInfo = this.productInfoList[0]
          this.dataForm.productId = this.productInfo.id
        }
      }
    },
    components: {
      ProductDrawer
    },
    methods: {
      init (id) {
        this.clickFlag = true
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.isDisabled = true
            this.$http({
              url: this.$http.adornUrl(`/transresources/trcarrierline/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.carrierName = data.trCarrierLine.carrierName
                // this.dataForm.prdName = data.trCarrierLine.prdName
                this.dataForm.carriageAreaName = data.trCarrierLine.carriageAreaName
                this.dataForm.startCityName = data.trCarrierLine.startCityName
                this.dataForm.endProvinceName = data.trCarrierLine.endProvinceName
                this.dataForm.endCityName = data.trCarrierLine.endCityName
                this.dataForm.goodSort = data.trCarrierLine.goodSort
                this.dataForm.isGoodLine = data.trCarrierLine.isGoodLine === 0 ? '是' : '否'
                this.dataForm.isUsedLine = data.trCarrierLine.isUsedLine === 1 ? '是' : '否'
                this.dataForm.belongProject = data.trCarrierLine.belongProject
                this.dataForm.remark = data.trCarrierLine.remark
                this.dataForm.productId = data.trCarrierLine.productId
                if (this.dataForm.productId !== '') {
                  this.selectProduct(this.dataForm.productId)
                }
              }
            })
          } else {
            this.isDisabled = false
            this.dataForm.attachmentUrl = ''
          }
        })
      },
      getDrawerInfo (id) {
        this.drawerVisible = true
        this.$nextTick(() => {
          this.$refs.productDrawer.init(id)
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
      getProductList () {
        this.$router.push({
          name: 'product-list'
        })
      },
      closeForm () {
        this.visible = false
        // this.$refs['attachment'].init()
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
  .box-card{
    /deep/.el-card__header {
      background-color: #3e8ef76b;
    }
  }
</style>
