<template>
  <div class="mod-config">
    <!--<hr style="border-bottom: none"/>-->
    <el-form label-width="50px" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label-width="0" style="background-color: #0886cb;padding-left: 20px;color: #ffffff">
        <!--<el-tag type="success">基本信息</el-tag>-->
        基本信息
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="编码:">
            <span style="display: block">
              {{dataForm.consignorNo}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="简称:">
            <span style="display: block">
              {{dataForm.shortOwnerName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="全称:">
            <span style="display: block">
              {{dataForm.ownerName}}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--<hr style="border-bottom: none"/>-->
    <el-form>
      <el-form-item style="background-color: #0886cb;padding-left: 20px;color: #ffffff">
        <!--<el-tag type="success">对应客商SAVE信息</el-tag>-->
        对应SAVE货主
      </el-form-item>
    </el-form>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        label="No."
        type="index"
        width="60">
      </el-table-column>
      <el-table-column
        prop="saveOwnerCode"
        header-align="center"
        align="center"
        label="SAVE货主编码"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="shortOwnerName"
        header-align="center"
        align="center"
        label="简称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="ownerName"
        header-align="center"
        align="center"
        label="全称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        header-align="center"
        width="120"
        align="center"
        label="状态">
        <template slot-scope="{row}">
          <el-tag v-if="row.isActive" size="small" type="danger">无效</el-tag>
          <el-tag v-else size="small">有效</el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column-->
      <!---->
      <!--header-align="center"-->
      <!--align="center"-->
      <!--width="150"-->
      <!--label="操作">-->
      <!--<template slot-scope="scope">-->
      <!--<el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>-->
      <!--<el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">详情</el-button>-->
      <!--<el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>-->
      <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
    <!--<el-pagination-->
    <!--@size-change="sizeChangeHandle"-->
    <!--@current-change="currentChangeHandle"-->
    <!--:current-page="pageIndex"-->
    <!--:page-sizes="[10, 20, 50, 100]"-->
    <!--:page-size="pageSize"-->
    <!--:total="totalPage"-->
    <!--layout="total, sizes, prev, pager, next, jumper">-->
    <!--</el-pagination>-->
    <!--<hr style="margin-top: 50px; border-bottom: none"/>-->
    <el-form style="margin-top: 30px">
      <el-form-item style="background-color: #0886cb;padding-left: 20px;color: #ffffff">
        更新状态
        <!--<el-tag type="success">更新状态</el-tag>-->
      </el-form-item>
    </el-form>
    <el-form label-width="80px">
      <el-row :gutter="24">
        <el-col :span="4">
          <el-form-item label="状态:">
            <span style="display: block">
              {{updateForm.status}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="创建人:">
            <span style="display: block">
              {{updateForm.createUserName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="创建时间:">
           <span style="display: block;">
              {{$formatDate(updateForm.createTime, 'Second')}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="更新人:">
            <span style="display: block">
              {{updateForm.updateUserName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="更新时间:">
            <span style="display: block">
              {{$formatDate(updateForm.updateTime, 'Second')}}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form>
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
    </el-form>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-button @click="$router.go(-1)">关闭</el-button>
      </el-col>
    </el-row>
    <product-drawer v-if="drawerVisible" ref="productDrawer"></product-drawer>
    <!-- 弹窗, 新增 / 修改 -->
    <!--<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>-->
  </div>
</template>

<script>
  import ProductDrawer from '../product/product-drawer'
  export default {
    data () {
      return {
        dataForm: {
          id: '',
          consignorNo: '',
          shortOwnerName: '',
          ownerName: ''
        },
        updateForm: {
          status: '',
          createUserName: '',
          updateUserName: '',
          createTime: '',
          updateTime: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        drawerVisible: false,
        productLists: []
      }
    },
    components: {
      ProductDrawer
    },
    activated () {
      // this.getDataList()
      this.init()
    },
    methods: {
      init () {
        let RECEIVE = this.$route.query
        this.dataForm.id = RECEIVE.id
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
            this.dataList = data.tTrConsignor.saveOwners
            this.dataForm.id = data.tTrConsignor.id
            this.dataForm.consignorNo = data.tTrConsignor.consignorNo
            this.dataForm.shortOwnerName = data.tTrConsignor.shortOwnerName
            this.dataForm.ownerName = data.tTrConsignor.ownerName
            this.updateForm.createUserName = data.tTrConsignor.sysCrtByName
            this.updateForm.updateUserName = data.tTrConsignor.sysMdfByName
            this.updateForm.createTime = data.tTrConsignor.sysCrtDtm
            this.updateForm.updateTime = data.tTrConsignor.sysMdfDtm
            this.updateForm.status = data.tTrConsignor.status ? '无效' : '有效'
            this.productLists = data.tTrConsignor.consignorProducts || []
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      getDrawerInfo (id) {
        this.drawerVisible = true
        this.$nextTick(() => {
          this.$refs.productDrawer.init(id)
        })
      },
      // 每页数
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
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
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
</style>
