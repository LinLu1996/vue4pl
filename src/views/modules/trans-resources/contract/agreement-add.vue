<template>
  <el-form :model="dataForm2" :rules="dataRule" ref="dataForm" label-width="100px">
    <el-form-item label-width="0">
      <el-tag>合同信息</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item label="合同编号：">
           <span style="width: 200px; display: block">
                {{dataForm.carrierCode}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="合同名称：">
           <span style="width: 200px; display: block">
                {{dataForm.carrierName}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="合同类型：">
           <span style="width: 200px; display: block">
                {{dataForm.contractName}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="承运商：">
             <span style="width: 200px; display: block">
                {{dataForm.shortName}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="履行期限：">
           <span style="width: 200px; display: block">
                {{$formatDate(dataForm.valueDate[0])}}~{{$formatDate(dataForm.valueDate[1])}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="签订日期：">
           <span style="width: 200px; display: block">
                {{$formatDate(dataForm.signDtm)}}
            </span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label-width="0">
      <el-tag>补充协议信息</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item label="签订日期" prop="signTime">
          <xkl-date-picker type="date" v-model="dataForm2.signTime" clearable placeholder="签订日期"></xkl-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="生效日期" prop="effectTime">
          <xkl-date-picker type="date" v-model="dataForm2.effectTime" clearable placeholder="生效日期"></xkl-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="到期日期" prop="invalidTime">
          <xkl-date-picker type="date" v-model="dataForm2.invalidTime" :pickerOptions="pickerOptions" clearable placeholder="到期日期"></xkl-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="协议名称" prop="agreementName">
          <el-input v-model="dataForm2.agreementName" maxlength="30" clearable placeholder="协议名称(单行输入)"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="承运商" prop="carrierId">
          <xkl-select style="width: 100%" v-model="dataForm2.carrierId" labelType="carrierName" linkage="/transresources/trcarrier/noPowerList" select-type="OPERATION_TYPE" placeholder="承运商"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="合同甲方" prop="carrierA">
          <el-input v-model="dataForm2.carrierA" maxlength="30" clearable placeholder="合同甲方"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="合同乙方" prop="carrierB">
          <el-input v-model="dataForm2.carrierB" maxlength="30" clearable placeholder="合同乙方"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="合同丙方" prop="carrierC">
          <el-input v-model="dataForm2.carrierC" maxlength="30" clearable placeholder="合同丙方"></el-input>
        </el-form-item>
      </el-col>
      <!--<el-col :span="8">-->
        <!--<el-form-item label="签订部门" prop="signDepart">-->
          <!--<xkl-select style="width: 100%" v-model="dataForm2.signDepart" keyType="departId" labelType="departName" :companyId="dataForm2.signCompany" linkage="/sys/sysdepart/getByCompanyId" placeholder="选择或输入查找"></xkl-select>-->
        <!--</el-form-item>-->
      <!--</el-col>-->
      <el-col :span="8">
        <el-form-item label="签订部门" prop="signDepName">
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
          <el-input v-model="dataForm2.signDepName" v-popover:menuListPopover readonly placeholder="签订部门" class="menu-list__input" clearable @focus="getMenuList()"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="补充内容" prop="sideContent">
          <el-input v-model="dataForm2.sideContent" maxlength="80" type="textarea" rows="4" placeholder="(多行输入)"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否续签" size="mini" prop="isRenewal">
          <el-radio-group v-model="dataForm2.isRenewal" @change="getAgreements">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="24" v-if="dataForm2.isRenewal === 0">
        <template>
          <el-form :model="contract" label-width="100px">
            <el-row v-if="contract.carrierStatus === 3">
              <el-col :span="8">
                <el-form-item label="合同">
                  <el-input v-model="contract.carrierName" maxlength="30" placeholder="合同" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8" style="text-align: center">
                <el-form-item label="到期日期">
                  <xkl-date-picker type="date" v-model="contract.carrierEndDtm" :pickerOptions="pickerOptions" clearable placeholder="到期日期"></xkl-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
            <el-row v-for="(item, index) in agreements" :key="index" style="margin-bottom: 0px">
              <el-form :model="item" label-width="100px">
                <el-col :span="8">
                  <el-form-item label="补充协议">
                    <el-input v-model="item.agreementName" maxlength="30" placeholder="补充协议" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="text-align: center">
                  <el-form-item label="到期日期">
                    <xkl-date-picker type="date" v-model="item.invalidTime" :pickerOptions="pickerOptions" placeholder="到期日期" clearable></xkl-date-picker>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
        </template>
      </el-col>
      <el-col :span="24">
        <el-form-item label="附件" prop="attachments">
          <xkl-upload v-model="dataForm2.attachments" :config="uploadConfig"></xkl-upload>
        </el-form-item>
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
  </el-form>
</template>

<script>
  import { formatDate, treeDataTranslate } from '@/utils'
  import Upload from '@/components/upload/upload'
  import ProductDrawer from '../product/product-drawer'
  import XklDatePicker from '../../../../components/global/xkl-datePicker';
  export default {
    data () {
      return {
        visible: false,
        drawerVisible: false,
        clickFlag: true,
        linkage: '1',
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
          signDtm: '',
          signDep: '',
          companyId: '',
          subProject: '',
          carrierStartDtm: '',
          carrierEndDtm: '',
          attachmentUrl: '',
          contractAttachment: '',
          carrierA: '',
          carrierB: '',
          carrierC: '',
          pathName: '',
          valueDate: [],
          contractProductIds: [],
          contractName: ''
        },
        dataForm2: {
          contractId: '',
          signTime: new Date(),
          effectTime: '',
          agreementName: '',
          sideContent: '',
          signCompany: '1',
          signDepart: '',
          attachments: [],
          invalidTime: '',
          isRenewal: 1,
          signDepName: '',
          carrierId: '',
          carrierA: '',
          carrierB: '',
          carrierC: ''
        },
        menuVisible: false,
        menuList: [],
        menuListTreeProps: {
          label: 'departName',
          children: 'children'
        },
        contract: {
          id: '',
          carrierName: '',
          carrierEndDtm: '',
          carrierStatus: ''
        },
        agreements: [],
        signDepData: [],
        productLists: [],
        loadUrl: '/transresources/trcontract/upload',
        downloadUrl: '/transresources/trcontract/download',
        dataRule: {
          signTime: [
            {required: true, message: '请选择签订日期', trigger: 'change'}
          ],
          effectTime: [
            { required: true, message: '请选择生效日期', trigger: 'change' }
          ],
          invalidTime: [
            { required: true, message: '请选择到期日期', trigger: 'change' }
          ],
          carrierEndDtm: [
            { required: true, message: '请选择到期日期', trigger: 'change' }
          ],
          isRenewal: [
            { required: true, message: '请选择是否续签', trigger: 'change' }
          ],
          signDepart: [
            { required: true, message: '请选择签订部门', trigger: 'blur' }
          ],
          signDepName: [
            { required: true, message: '请选择签订部门', trigger: 'change' }
          ],
          agreementName: [
            { required: true, message: '请填写协议名称', trigger: 'blur' }
          ],
          sideContent: [
            { required: true, message: '请填写补充内容', trigger: 'blur' }
          ],
          carrierId: [
            { required: true, message: '请选择承运商', trigger: 'change' }
          ],
          carrierA: [
            { required: true, message: '请输入合同甲方', trigger: 'blur' }
          ],
          carrierB: [
            { required: true, message: '请输入合同乙方', trigger: 'blur' }
          ]
        },
        uploadConfig: {
          fileListType: 'picture-card', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/transresources/trcontract/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: false // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
        },
        fileList: [],
        levelDate: '',
        pickerOptions: {
          // disabledDate (value) {
          //   if (Date.now() - 24 * 60 * 60 * 1000 >= value) {
          //     return true
          //   }
          //   return false
          // }
        },
        isDisabled: false
      }
    },
    watch: {
      '$route.params' (newVal) {
        if (this.$route.params.length) {
          this.productLists = this.$route.params
          if (this.productLists) {
            this.dataForm.contractProductIds = this.productLists.map(res => {
              return res.id
            })
          }
        }
      },
      'dataForm2.invalidTime' () {
        if (this.dataForm2.invalidTime) {
          this.agreements = this.agreements.map(res => {
            res.invalidTime = this.dataForm2.invalidTime
            return res
          })
          this.contract.carrierEndDtm = this.dataForm2.invalidTime
        }
      },
      'dataForm2.signDepName' (newVal) {
        if (newVal === '') {
          this.dataForm2.signDepart = undefined
        }
      }
    },
    components: {
      XklDatePicker,
      Upload,
      ProductDrawer
    },
    created () {
      const contractId = this.$route.query.contractId || null
      const id = this.$route.query.id || null
      this.dataForm2.contractId = contractId
      this.contract.id = contractId
      this.dataForm2.id = id
      this.dataForm2.signCompany = this.$route.query.signCompany
      this.init(contractId)
      this.dataForm2.trcontract = []
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
              url: this.$http.adornUrl(`/transresources/trcontract/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.carrierCode = data.tTrContract.carrierCode
                this.dataForm.carrierType = data.tTrContract.carrierType ? data.tTrContract.carrierType.toString() : ''
                this.dataForm.carrierName = data.tTrContract.carrierName
                this.dataForm.shortName = data.tTrContract.shortName
                this.dataForm.carrierId = data.tTrContract.carrierId
                this.dataForm.signDtm = data.tTrContract.signDtm ? formatDate(data.tTrContract.signDtm) : '';
                this.dataForm.subProject = data.tTrContract.subProject
                this.dataForm.attachmentUrl = data.tTrContract.attachmentUrl
                this.dataForm.contractAttachment = data.tTrContract.contractAttachment
                this.dataForm.carrierA = data.tTrContract.carrierA
                this.dataForm.carrierB = data.tTrContract.carrierB
                this.dataForm.carrierC = data.tTrContract.carrierC
                this.dataForm.signDep = data.tTrContract.signDep
                // this.signDepName = data.tTrContract.departName
                this.dataForm.pathName = data.tTrContract.pathName
                this.dataForm.contractName = data.tTrContract.contractName
                this.dataForm.contractProductIds = data.tTrContract.contractProductIds
                this.dataForm.invalidTime = data.tTrContract.invalidTime
                this.dataForm.isRenewal = data.tTrContract.isRenewal
                this.productLists = data.tTrContract.contractProductList
                this.dataForm.valueDate = [
                  data.tTrContract.carrierStartDtm ? formatDate(data.tTrContract.carrierStartDtm) : null,
                  data.tTrContract.carrierEndDtm ? formatDate(data.tTrContract.carrierEndDtm) : null
                ]
                this.contract.carrierName = data.tTrContract.carrierName
                this.contract.carrierStatus = data.tTrContract.carrierStatus
                this.dataForm2.invalidTime = this.dataForm.valueDate[1]
                this.dataForm2.carrierId = data.tTrContract.carrierId
                this.dataForm2.carrierA = data.tTrContract.carrierA
                this.dataForm2.carrierB = data.tTrContract.carrierB
                this.dataForm2.carrierC = data.tTrContract.carrierC
                // this.contract.carrierEndDtm = formatDate(data.tTrContract.carrierEndDtm)
              }
            }).then(() => {
              if (this.dataForm2.id) {
                this.$http({
                  url: this.$http.adornUrl(`/transresources/trcontract/info/${this.dataForm.id}`),
                  method: 'get',
                  params: this.$http.adornParams()
                }).then(({data}) => {
                  if (data && data.code === 0) {
                  }
                })
              }
            })
          } else {
            this.dataForm.attachmentUrl = ''
          }
        })
      },
      getAgreements () {
        if (this.dataForm2.isRenewal === 0) {
          this.$http({
            url: this.$http.adornUrl(`/transresources/trcontractsideagreement/list`),
            method: 'post',
            data: this.$http.adornData({
              'contractId': this.dataForm2.contractId,
              'status': 3
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.contract.carrierEndDtm = this.dataForm2.invalidTime
              this.agreements = data.list ? data.list : []
              if (this.dataForm2.invalidTime) {
                this.agreements = this.agreements.map(res => {
                  res.invalidTime = this.dataForm2.invalidTime
                  return res
                })
              } else {
                this.agreements = this.agreements.map(res => {
                  res.invalidTime = ''
                  return res
                })
              }
            }
          })
        } else {
          this.agreements = []
        }
      },
      getMenuList () {
        this.$http({
          url: this.$http.adornUrl('/sys/sysdepart/getByCompanyId'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            // 'limit': this.linkage ? this.pageSize : 999,
            'limit': 999,
            'belongCompany': this.dataForm2.signCompany || undefined
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
        this.dataForm2.signDepart = data.departId
        this.dataForm2.signDepName = data.departName
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
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.clickFlag) {
              return;
            }
            this.clickFlag = false
            this.$http({
              url: this.$http.adornUrl(`/transresources/trcontractsideagreement/save`),
              method: 'post',
              data: this.$http.adornData({
                ...this.dataForm2,
                'agreements': this.agreements,
                'contract': this.contract
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
      getProductList (type) {
        this.$router.push({
          name: 'product-list',
          params: {
            type: type
          }
        })
      },
      deleteProduct (index) {
        this.productLists.splice(index, 1)
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
