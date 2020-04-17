<template>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
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
      <el-col :span="24">
        <el-form-item label="备注：">
          <span style="white-space:normal; word-break:break-all;">
                {{dataForm.remark}}
          </span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label-width="0">
      <el-tag>承运区域</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="24">
        <div class="shuttle">
          <div class="shuttle_item">
            <span>承运区域</span>
            <ul class="school">
              <li v-for="(item ,index ) in areaList" :key="index">
                <label :for="item.id">{{item.name}}</label>
              </li>
            </ul>
          </div>
          <div class="shuttle_arrow">

          </div>
          <div class="shuttle_item">
            <span>运作区域</span>
            <ul class="school">
              <li v-for="(item ,index ) in runList" :key="index">
                <label :for="item.id">{{item.name}}</label>
              </li>
            </ul>
          </div>
          <div class="shuttle_arrow">

          </div>
          <div class="shuttle_item">
            <span>优势区域</span>
            <ul class="school">
              <li v-for="(item,index) in goodArea" :key="index">
                <label :for="item.id">{{item.name}}</label>
              </li>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-form-item>
          <el-button @click="$router.push({name: 'trans-resources-carrier-area/carrier-area'})">关闭</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  /* import { formatDate } from '@/utils'
  import attachmentUpload from '@/components/upload/attachmentUpload'
  import ProductDrawer from '../product/product-drawer' */
  export default {
    data () {
      let verifyChar = (rule, value, callback) => {
        let patrn = /^(\w){0,30}$/;
        if (!patrn.exec(value)) {
          callback(new Error('只能输入字母、数字、下划线'))
        }
        callback()
      }
      return {
        inputVal: '',
        pageIndex: 1,
        visible: false,
        allArea: [],
        allAreaList: [],
        areaList: [],
        runList: [],
        goodArea: [],
        schoolsNames: [],
        teamName: [],
        teamLeader: [],
        schoolInfo: '',
        teamInfo: '',
        leaderInfo: '',
        dataForm: {
          id: 0,
          /* carrierCode: '',
          carrierType: '',
          carrierName: '',
          shortName: '', */
          carrierId: '',
          carrierName: '',
          remark: ''
        },
        dataRule: {
          carrierId: [
            { required: true, message: '请填写承运商名称', trigger: 'change' },
            { validator: verifyChar, trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      schoolInfo (val) {   //  编辑时用来回显，添加时的默认数据
        this.schoolInfo = val;
        this.allArea = val;
      },
      teamInfo (val) {   //  编辑时用来回显
        this.teamInfo = val;
        this.areaList = val;
      },
      leaderInfo (val) {   //  编辑时用来回显
        this.leaderInfo = val;
        this.goodArea = val;
      }
    },
    activated () {
      const carrierId = this.$route.query.carrierId || null
      this.init(carrierId)
    },
    methods: {
      init (carrierId) {
        this.clickFlag = true
        if (carrierId && carrierId.trim() !== '') {
          this.dataForm.carrierId = carrierId
        }
        this.dataForm.remark = '';
        this.areaList = [];
        this.runList = [];
        this.goodArea = [];
        this.visible = true
        this.inputVal = ''
        this.$nextTick(() => {
          if (carrierId && carrierId.trim() !== '') {
            this.$http({
              url: this.$http.adornUrl(`/transresources/trcarrierarea/area/${this.dataForm.carrierId}`),
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 0) {
                if (data.areaList && data.areaList.length > 0) {
                  this.dataForm.remark = data.areaList[0].remark;
                  this.dataForm.carrierName = data.areaList[0].carrierName;
                  data.areaList.forEach((item, index) => {
                    this.areaList.push(item);
                    if (item.isGoodArea && item.isGoodArea === 1) {
                      this.goodArea.push(item)
                    }
                    if (item.isUsedArea && item.isUsedArea === 1) {
                      this.runList.push(item)
                    }
                  });
                }
              } else {
              }
            })
          }
        })
      },
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.clickFlag) {
              return;
            }
            this.clickFlag = false
            // const newRoad = []
            this.$http({
              url: this.$http.adornUrl('/transresources/trcarrierarea/saveArea'),
              method: 'post',
              data: this.$http.adornData({
                ...this.dataForm,
                areaList: this.areaList,
                goodAreaList: this.goodArea
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.$router.push({name: 'trans-resources-carrier-area/carrier-area'})
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
  ul li {
    list-style: none;
  }

  .shuttle {
    display: flex;
    flex-direction: row;
    justify-content: center;

    .shuttle_item {
      width: 20%;

      span {
        font-size: 16px;
        margin-left: 50px;
      }
    }

    .shuttle_arrow {
      width: 10%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0 10px 0 40px;

      .go_left {
        margin-left: 0;
        margin-top: 15px;
      }
    }

    .school {
      border: 1px solid #c8c9cc;
      padding: 0 10px;
      border-radius: 5px;
      width: 120%;
      height: 300px;
      overflow: auto;
      li {
        padding-top: 10px;
      }
    }
  }
</style>
