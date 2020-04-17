<template>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
    <el-form-item label-width="0">
      <el-tag>基本信息</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item v-if="dataForm.id" label="合同编号" prop="carrierCode">
          <el-input v-model="dataForm.carrierCode" maxlength="30" :disabled="!!dataForm.id" clearable placeholder="合同编号"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="承运商" prop="carrierId">
          <xkl-select style="width: 100%" v-model="dataForm.carrierId" labelType="carrierName" linkage="/transresources/trcarrier/findList " placeholder="承运商名称" @getItem="getItem"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="合同名称" prop="carrierName">
          <el-input v-model="dataForm.carrierName" maxlength="30" clearable placeholder="合同名称"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="合同类型" prop="carrierType">
          <xkl-select style="width: 100%" v-model="dataForm.carrierType" keyType="carrierType" select-type="CONTRACT_TYPE" placeholder="合同类型"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="合同甲方" prop="carrierA">
          <el-input v-model="dataForm.carrierA" maxlength="30" clearable placeholder="合同主体(甲方)"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="合同乙方" prop="carrierB">
          <el-input v-model="dataForm.carrierB" maxlength="30" clearable placeholder="合同主体(乙方)"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="合同丙方" prop="carrierC">
          <el-input v-model="dataForm.carrierC" maxlength="30" clearable placeholder="合同主体(丙方)"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="签订日期" prop="signDtm">
          <xkl-date-picker type="date" v-model="dataForm.signDtm" placeholder="签订日期"></xkl-date-picker>
        </el-form-item>
      </el-col>
      <!--<el-col :span="8">-->
        <!--<el-form-item label="签订部门" prop="signDep">-->
          <!--<xkl-select style="width: 100%" v-model="dataForm.signDep" keyType="departId" labelType="departName" :companyId="dataForm.signCompany" :linkage="'/sys/sysdepart/getByCompanyId'" placeholder="签订部门"></xkl-select>-->
        <!--</el-form-item>-->
      <!--</el-col>-->
      <el-col :span="8">
        <el-form-item label="签订部门" prop="signDep">
          <el-popover
            width="200"
            ref="menuListPopover"
            placement="bottom-start"
            trigger="click"
            v-model="menuVisible">
            <el-tree
              :data="menuList"
              :props="menuListTreeProps"
              node-key="departId"
              ref="menuListTree"
              class="menu-el-tree"
              @current-change="menuListTreeCurrentChangeHandle"
              :default-expand-all="true"
              :highlight-current="true"
              :expand-on-click-node="false">
            </el-tree>
          </el-popover>
          <el-input v-model="signDepName" v-popover:menuListPopover readonly placeholder="签订部门" class="menu-list__input" clearable @focus="getMenuList()"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="涉及项目">
          <el-input v-model="dataForm.subProject" maxlength="30" clearable placeholder="所属项目"></el-input>
        </el-form-item>
      </el-col>
      <!--<el-col :span="8">-->
        <!--<el-form-item label="运营中心" prop="signCompany">-->
          <!--<xkl-select style="width: 100%" v-model="dataForm.signCompany" keyType="companyId" labelType="fullName" linkage="/sys/toperationcenter/list" placeholder="运营中心"></xkl-select>-->
        <!--</el-form-item>-->
      <!--</el-col>-->
      <el-col :span="8">
        <el-form-item label="履行期限" prop="valueDate">
          <xkl-date-picker type="daterange" v-model="dataForm.valueDate" placeholder="合同有效期"></xkl-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注信息">
          <el-input v-model="dataForm.remark" type="textarea" maxlength="120" rows="4"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label-width="0">
      <el-tag>合同附件</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="24">
        <el-form-item label="合同附件" prop="attachmentUrl">
          <xkl-upload v-model="dataForm.contractAttachment" :config="uploadConfig"></xkl-upload>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label-width="0">
      <el-tag>运输产品</el-tag>
    </el-form-item>
    <el-row>
      <el-col style="text-align: right">
        <el-form-item style="margin-bottom: 5px;margin-right: 30px">
          <el-button type="success" @click="getProductList('contract')" size="mini">
            <icon-svg name="选择" style="vertical-align: middle"></icon-svg>
            选择</el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="!productLists.length">
      <el-col>
        <div style="height: 100px;line-height: 100px;text-align: center;font-size: 20px;color: #CCCCCC">暂无运输产品！</div>
      </el-col>
    </el-row>
    <el-row v-else>
      <el-col :span="6" v-for="(item, index) in productLists" key="item" style="margin-bottom: 20px">
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
             white-space:nowrap;">{{item.prdName}}</span>
              <el-button style="float: right; padding: 3px 0;color: #ffffff" type="text" icon="el-icon-delete" @click="deleteProduct(index)"></el-button>
            </div>
            <div class="text item">{{'运输方式：' + item.tpModeName }}</div>
            <div class="text item">{{'配载方式：' + item.loadingModeName }}</div>
            <div class="text item">{{'温控类型：' + item.tempModeName }}</div>
            <el-button style="padding: 3px 0" type="text" @click="getDrawerInfo(item.id)">详 情</el-button>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-form-item>
          <el-button @click="$router.push({name: 'trans-resources-contract/contract-management'})">关闭</el-button>
          <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <product-drawer v-if="drawerVisible" ref="productDrawer"></product-drawer>
  </el-form>
</template>

<script>
  import { formatDate, treeDataTranslate } from '@/utils'
  import attachmentUpload from '@/components/upload/attachmentUpload'
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
      return {
        visible: false,
        drawerVisible: false,
        clickFlag: true,
        linkage: '1',
        id: '',
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataForm: {
          id: 0,
          carrierCode: '',
          carrierType: '',
          carrierName: '',
          shortName: '',
          carrierId: '',
          signDtm: new Date(),
          signDep: '',
          signCompany: '',
          subProject: '',
          carrierStartDtm: '',
          carrierEndDtm: '',
          contractFileUrl: [],
          contractAttachment: [],
          carrierA: '',
          carrierB: '',
          carrierC: '',
          pathName: '',
          valueDate: [],
          contractProductIds: [],
          remark: ''
        },
        signDepName: '',
        signDepData: [],
        productLists: [],
        uploadConfig: {
          fileListType: 'picture-card', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/transresources/trcontract/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: false, // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
          id: ''
        },
        menuVisible: false,
        menuList: [],
        menuListTreeProps: {
          label: 'departName',
          children: 'children'
        },
        dataRule: {
          carrierCode: [
            {required: true, message: '请填写合同编号', trigger: 'blur'}
          ],
          carrierId: [
            { required: true, message: '请填写承运商名称', trigger: 'change' },
            { validator: verifyChar, trigger: 'blur' }
          ],
          carrierName: [
            { required: true, message: '请填写合同名称', trigger: 'blur' }
          ],
          carrierType: [
            { required: true, message: '请选择合同类型', trigger: 'change' }
          ],
          carrierA: [
            { required: true, message: '请填写合同主体（甲方）', trigger: 'blur' }
          ],
          carrierB: [
            { required: true, message: '请填写合同主体（乙方）', trigger: 'blur' }
          ],
         /* carrierC: [
            { required: true, message: '请填写合同主体（丙方）', trigger: 'blur' }
          ], */
          subProject: [
            { required: true, message: '请填写所属项目', trigger: 'change' }
          ],
          signDtm: [
            { required: true, message: '请选择签订日期', trigger: 'change' }
          ],
          companyId: [
            { required: true, message: '请填写签订公司', trigger: 'change' }
          ],
          signDep: [
            { required: false, message: '请选择签订部门', trigger: 'change' }
          ],
          valueDate: [
            { required: true, message: '请选择合同有效期', trigger: 'change' }
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
          this.productLists = this.$route.params
          this.dataForm.contractProductIds = this.productLists.map(res => {
            return res.id
          })
        }
      },
      'dataForm.carrierId' (newVal, oldVal) {
        // if (oldVal) {
        this.dataForm.signDep = ''
        this.signDepName = ''
        // }
      },
      'signDepName' (newVal) {
        if (newVal === '') {
          this.dataForm.signDep = undefined
        }
      }
    },
    components: {
      attachmentUpload,
      ProductDrawer
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.clickFlag = true
        this.dataForm.id = this.$route.query.id || 0
        this.uploadConfig.id = this.$route.query.id || null
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.isDisabled = true
            this.$http({
              url: this.$http.adornUrl(`/transresources/trcontract/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.carrierCode = data.tTrContract.carrierCode
                this.dataForm.carrierType = data.tTrContract.carrierType ? data.tTrContract.carrierType.toString() : ''
                this.dataForm.carrierName = data.tTrContract.carrierName
                this.dataForm.carrierId = data.tTrContract.carrierId
                this.dataForm.signDtm = data.tTrContract.signDtm
                this.dataForm.subProject = data.tTrContract.subProject
                this.dataForm.contractAttachment = data.tTrContract.contractFileList
                this.dataForm.carrierA = data.tTrContract.carrierA
                this.dataForm.carrierB = data.tTrContract.carrierB
                this.dataForm.carrierC = data.tTrContract.carrierC
                this.dataForm.signCompany = parseInt(data.tTrContract.signCompany) || ''
                this.dataForm.pathName = data.tTrContract.pathName
                this.dataForm.remark = data.tTrContract.remark
                this.productLists = data.tTrContract.contractProductList
                this.dataForm.contractProductIds = this.productLists.map(res => {
                  return res.id
                })
                this.dataForm.valueDate = [
                  data.tTrContract.carrierStartDtm,
                  data.tTrContract.carrierEndDtm
                ]
                this.$nextTick(() => {
                  this.dataForm.signDep = data.tTrContract.signDep
                  this.signDepName = data.tTrContract.departName
                })
              }
            })
          } else {
            this.isDisabled = false
            this.dataForm.attachmentUrl = ''
          }
        })
      },
      getMenuList () {
        this.$http({
          url: this.$http.adornUrl('/sys/sysdepart/getByCompanyId'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            // 'limit': this.linkage ? this.pageSize : 999,
            'limit': 999,
            'belongCompany': this.dataForm.signCompany || undefined
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.menuList = treeDataTranslate(data.page.list, 'departId', 'parentDepartId');
            this.menuList = this.menuList.map(res => {
              res.disabled = true
              return res
            })
            // this.$store.commit('dict/updateList', this.dataList)
            this.totalPage = data.page.totalCount
          } else {
            this.menuList = []
            this.totalPage = 0
          }
          this.loading = false
        })
      },
      menuListTreeCurrentChangeHandle (data, node) {
        // this.dataForm.parentId = data.menuId
        this.dataForm.signDep = data.departId
        this.signDepName = data.departName
        this.menuVisible = false
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
        if (!this.dataForm.contractProductIds.length) {
          this.$message({
            type: 'warning',
            message: '请选择运输产品'
          })
          return false
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.clickFlag) {
              return;
            }
            this.clickFlag = false
            this.$http({
              url: this.$http.adornUrl(`/transresources/trcontract/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.uploadConfig.id,
                'carrierCode': this.dataForm.carrierCode,
                'carrierType': this.dataForm.carrierType,
                'carrierName': this.dataForm.carrierName,
                'carrierId': this.dataForm.carrierId,
                'signDtm': formatDate(this.dataForm.signDtm),
                'subProject': this.dataForm.subProject,
                'carrierStartDtm': formatDate(this.dataForm.valueDate[0]),
                'carrierEndDtm': formatDate(this.dataForm.valueDate[1]),
                'contractFileUrl': this.dataForm.contractAttachment.map(item => {
                  return item.path;
                }),
                'carrierA': this.dataForm.carrierA,
                'carrierB': this.dataForm.carrierB,
                'carrierC': this.dataForm.carrierC,
                'signCompany': this.dataForm.signCompany,
                'signDep': this.dataForm.signDep,
                'contractProductIds': this.dataForm.contractProductIds,
                'remark': this.dataForm.remark
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.$router.push({name: 'trans-resources-contract/contract-management'})
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
      getItem (item) {
        this.dataForm.signCompany = item.signCompany
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
            isSelected: this.productLists
          }
        })
      },
      deleteProduct (index) {
        this.productLists.splice(index, 1)
        this.dataForm.contractProductIds = this.productLists.map(res => {
          return res.id
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
  /deep/.menu-el-tree{
    height: 280px;
    overflow-y: scroll;
  }
</style>
