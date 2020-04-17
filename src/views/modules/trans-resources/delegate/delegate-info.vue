<template>
  <el-dialog
    title="基本信息"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%">
    <div class="mod-config">
      <el-form :inline="true" :model="dataForm" label-width="100px" @keyup.enter.native="getDataList()">
        <el-row>
          <el-col :span="12">
            <el-form-item label="委托方编码:">
              <span style="width: 200px; display: block">
                {{dataForm.consignorNo}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="委托方简称:">
              <span style="width: 200px; display: block">
                {{dataForm.shortOwnerName}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="委托方名称:">
              <span style="width: 200px; display: block">
                {{dataForm.ownerName}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否内部委托方:">
              <span style="width: 200px; display: block">
                {{dataForm.isInsideOwner === 0 ? '是' : '否'}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label-width="0">
          <el-tag>运输产品</el-tag>
        </el-form-item>
        <el-row v-if="!productLists.length">
          <el-col>
            <div style="height: 100px;line-height: 100px;text-align: center;font-size: 20px;color: #CCCCCC">暂无运输产品！</div>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :span="7" v-for="(item, index) in productLists" key="item" style="margin-bottom: 20px">
            <div style="width: 90%;margin: 0 auto">
              <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                  <span style="color: #ffffff;font-size: 16px;font-weight: bold">{{item.prdName}}</span>
                </div>
                <div class="text item">{{'运输方式：' + item.tpModeName }}</div>
                <div class="text item">{{'配载方式：' + item.loadingModeName }}</div>
                <div class="text item">{{'温控类型：' + item.tempModeName }}</div>
                <el-button style="padding: 3px 0" type="text" @click="getDrawerInfo(item.id)">详 情</el-button>
              </el-card>
            </div>
          </el-col>
        </el-row>
        <product-drawer v-if="drawerVisible" ref="productDrawer"></product-drawer>
      </el-form>
      <!--<h3 style="height: 40px;line-height: 20px">更新状态</h3>-->
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
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
        dataForm: {
          ownerName: '',
          consignorNo: '',
          shortOwnerName: '',
          isInsideOwner: '',
          recordDtm: ''
        },
        productLists: []
      }
    },
    components: {
      ProductDrawer
    },
    activated () {
    },
    methods: {
      init (id) {
        this.dataForm.id = id
        this.visible = true
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/transresources/ttrconsignor/info/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.ownerName = data.tTrConsignor.ownerName
            this.dataForm.consignorNo = data.tTrConsignor.consignorNo
            this.dataForm.shortOwnerName = data.tTrConsignor.shortOwnerName
            this.dataForm.isInsideOwner = data.tTrConsignor.isInsideOwner
            this.dataForm.recordDtm = data.tTrConsignor.recordDtm
            this.productLists = data.tTrConsignor.consignorProducts
          }
        })
      },
      getDrawerInfo (id) {
        this.drawerVisible = true
        this.$nextTick(() => {
          this.$refs.productDrawer.init(id)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 10px;
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
