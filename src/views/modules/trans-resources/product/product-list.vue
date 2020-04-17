<template>
  <el-form label-width="100px">
    <el-row>
      <el-col :span="6">
        <el-form-item label-width="30px">
          <h2 style="margin: 0">产品列表</h2>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="产品名称">
          <el-input v-model="dataForm.prdName" placeholder="产品名称" maxlength="30" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="运输方式">
          <xkl-select style="width: 100%" v-model="dataForm.tpMode" placeholder="运输方式" select-type="TRANSPORT_TYPE"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="配载方式">
          <xkl-select style="width: 100%" v-model="dataForm.loadingMode" keyType="shipmentKey" labelType="shipmentName" linkage="/transresources/tbasicshipment/list"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="温控类型">
          <xkl-select style="width: 100%" v-model="dataForm.tempMode" placeholder="温控类型" select-type="TEMP_MODE"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="16" style="text-align: right;padding-right: 5px">
        <el-form-item label-width="20px">
          <el-button type="warning" icon="el-icon-search" @click="searchDataList()">查询</el-button>
          <el-button style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="!dataList.length">
      <el-col>
        <div style="height: 100px;line-height: 100px;text-align: center;font-size: 20px;color: #CCCCCC">暂无运输产品！</div>
      </el-col>
    </el-row>
    <el-row v-loading="productLoading">
      <el-col :span="6" v-for="(item, index) in dataList" key="item" style="margin-bottom: 20px">
        <div style="width: 90%;margin: 0 auto">
          <el-card :class="{'box-card': true,'active' : item.isActive}" :style="item.isActive && isSelected" shadow="never" @click.native="sendProducts(item, index)">
            <div slot="header" class="clearfix">
              <span style="color: #ffffff;
              display: block;
              width: 90%;
              font-size: 20px;
              font-weight: bold;
              overflow:hidden;
             text-overflow:ellipsis;
             white-space:nowrap;">{{item.prdName}}</span>
            </div>
            <div class="text item">{{'运输方式：' + item.tpModeName }}</div>
            <div class="text item">{{'配载方式：' + item.loadingModeName }}</div>
            <div class="text item">{{'温控类型：' + item.tempModeName }}</div>
            <el-button style="padding: 3px 0" type="text" @click.stop="getDrawerInfo(item.id)">详 情</el-button>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[8, 12, 24, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <product-drawer v-if="drawerVisible" ref="productDrawer"></product-drawer>
    <el-row style="margin-top: 30px">
      <el-col style="text-align: right;padding-right: 30px">
        <el-form-item>
          <el-button @click="$router.go(-1)">关闭</el-button>
          <el-button type="primary" @click="dataFormSubmit(fromType)">确定</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import ProductDrawer from './product-drawer'
export default {
  data () {
    return {
      dataForm: {
        prdNo: '',
        prdName: '',
        tpMode: '',
        loadingMode: '',
        tempMode: ''
      },
      productLoading: false,
      drawerVisible: false,
      colorChange: '',
      currentIndex: '',
      fromType: '',
      delegateId: '',
      pageIndex: 1,
      pageSize: 12,
      totalPage: 0,
      dataList: [],
      selectedProducts: [],
      selectedIds: [],
      isActive: '',
      isSelected: 'background-color: #eeeeee; cursor: pointer;',
      isSelectedList: []
    }
  },
  components: {
    ProductDrawer
  },
  created () {
    this.init()
  },
  watch: {
    '$route.params' (newVal) {
      if (this.$route.params.type) {
        this.init()
      }
    }
  },
  methods: {
    init () {
      this.selectedProducts = []
      this.fromType = this.$route.params.type
      this.delegateId = this.$route.params.id
      this.id = this.$route.params.id
      this.selectedProducts = this.$route.params.isSelected || []
      this.$nextTick(() => {
        this.resetForm()
      })
    },
    searchDataList () {
      this.pageIndex = 1
      this.getDataList()
    },
    getDataList () {
      this.productLoading = true
      this.$http({
        url: this.$http.adornUrl('/transresources/trproduct/list'),
        method: 'post',
        data: this.$http.adornData({
          ...this.dataForm,
          'isEnabled': 0,
          'page': this.pageIndex,
          'limit': this.pageSize
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.dataList = this.dataList.map(res => {
            for (let i = 0; i < this.selectedProducts.length; i++) {
              const item = this.selectedProducts[i]
              res.isActive = false
              if (item.id === res.id) {
                res.isActive = true
                break
              }
            }
            for (let i = 0; i < this.selectedProducts.length; i++) {
              const item = this.selectedProducts[i]
              if (item.id === res.id) {
                res.isActive = true
                break
              }
            }
            res.isEnabled === 0 ? res.isEnabled = true : res.isEnabled = false
            this.selectedIds = this.selectedProducts.map(res => {
              return res.id
            })
            return res
          })
          this.totalPage = data.page.totalCount
          this.productLoading = false
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        // this.selectedProducts = []
        this.productLoading = false
      })
    },
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    getDrawerInfo (id) {
      this.drawerVisible = true
      this.$nextTick(() => {
        this.$refs.productDrawer.init(id)
      })
    },
    sendProducts (item, index) {
      this.dataList[index].isActive = !item.isActive
      if (item.isActive) {
        this.selectedProducts.push(item)
      } else {
        for (let i = 0; i < this.selectedProducts.length; i++) {
          if (item.id === this.selectedProducts[i].id) {
            this.selectedProducts.splice(i, 1)
          }
        }
      }
      this.$nextTick(() => {
        this.selectedIds = this.selectedProducts.map(res => {
          return res.id
        })
      })
      this.$forceUpdate()
    },
    dataFormSubmit (type) {
      this.selectedProducts = this.selectedProducts.filter((x, index) => {
        let arrids = []
        this.selectedProducts.forEach((item) => {
          arrids.push(item.id)
        })
        let judgeOne = arrids.indexOf(x.id) === index && x.id
        return judgeOne
      })
      if (type === 'contract') {
        this.$router.push({
          name: 'contract-add-or-update',
          params: this.selectedProducts
        })
      } else if (type === 'invoice') {
        if (this.selectedProducts.length > 1) {
          this.$message({
            type: 'warning',
            message: '只能选择一个产品'
          })
          return false
        }
        this.$router.push({
          name: 'invoice-add',
          query: {
            id: this.id,
            type: 'invoice'
          },
          params: this.selectedProducts
        })
      } else if (type === 'delegate') {
        if (this.delegateId) {
          this.$http({
            url: this.$http.adornUrl('/transresources/trconsignorproduct/setProduct'),
            method: 'post',
            data: this.$http.adornData({
              'trProductIdList': this.selectedIds,
              'consignorId': this.delegateId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$router.push({
                name: 'trans-resources-delegate/delegate'
              })
            }
          })
        }
      } else if (type === 'line') {
        if (this.selectedProducts.length > 1) {
          this.$message({
            type: 'warning',
            message: '只能选择一个产品'
          })
          return false
        }
        this.$router.push({
          name: 'line-add-or-update',
          params: this.selectedProducts
        })
      } else if (type === 'custom') {
        if (this.delegateId) {
          this.$http({
            url: this.$http.adornUrl('/transresources/trconsignorproduct/setProduct'),
            method: 'post',
            data: this.$http.adornData({
              'trProductIdList': this.selectedIds,
              'consignorId': this.delegateId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message.success('添加成功')
              this.$router.push({
                name: 'trans-resources-custom-manage/custom-manage'
              })
            }
          })
        }
      }
    },
    resetForm () {
      this.dataForm = {}
      this.pageIndex = 1
      this.pageSize = 12
      this.getDataList()
    }
  }
}
</script>
<style lang="scss" scoped>
  /deep/.el-checkbox-button {
    .el-checkbox-button__inner{
      min-width: 280px!important;
      border-color: #ffffff!important;
      padding: 2px;
    }
  }
  /deep/ .el-checkbox-button.is-checked .el-checkbox-button__inner{
    /*background-color: #f5f5f5!important;*/
    /*border-color: #f5f5f5!important;*/
  }
  .text {
    font-size: 14px;
    text-align: left;
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
  @keyframes myfirst
  {
    0% {background: #ffffff; width: 260px;height: 220px}
    30% {background: #eeeeee;}
    60% {background: #ffffff;}
    100% {background: #eeeeee;}
  }
  .active{
    animation: myfirst 0.5s;
  }
  .box-card{
    width: 100%;
    margin: 0 auto;
    &:hover{
      background-color: #eeeeee;
      cursor: pointer;
    }
    /deep/.el-card__header {
      background-color: #3e8ef76b;
    }
  }
</style>
