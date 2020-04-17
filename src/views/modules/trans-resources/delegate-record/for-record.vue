<template>
  <div class="tem-content">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-row>
        <el-col v-if="dataForm.id" :span="8">
          <el-form-item label="备案编号" prop="recordNo">
            <el-input v-model="dataForm.recordNo" disabled placeholder="备案编号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备案名称" prop="recordName">
            <el-input v-model="dataForm.recordName" placeholder="备案名称" maxlength="16" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="委托方名称" prop="consignorId">
            <xkl-select style="width: 100%" v-model="dataForm.consignorId" :disabled="!!dataForm.id" labelType="ownerName" linkage="/transresources/ttrconsignor/noPowerList" placeholder="承运商名称"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="适用范围">
            <el-input v-model="dataForm.supportRange" placeholder="适用范围" maxlength="40" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="dataForm.remark" type="textarea" maxlength="120" rows="5"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="承运商" prop="carrierName">
        <el-row>
          <el-col :span="20">
            <el-input type="textarea" v-model="dataForm.carrierName" readonly></el-input>
          </el-col>
          <el-col :span="3" style="text-align: right">
            <el-button type="success" size="small" @click="changeCarrier('carrier')">
              <icon-svg name="选择" style="vertical-align: middle"></icon-svg>
              选择</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="车辆" prop="carNumber">
        <el-row>
          <el-col :span="20">
            <el-input type="textarea" v-model="dataForm.carNumber" readonly></el-input>
          </el-col>
          <el-col :span="3" style="text-align: right">
            <el-button type="success" size="small" @click="changeCarrier('car')">
              <icon-svg name="选择" style="vertical-align: middle"></icon-svg>
              选择</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="司机" prop="driverName">
        <el-row>
          <el-col :span="20">
            <el-input type="textarea" v-model="dataForm.driverName" readonly></el-input>
          </el-col>
          <el-col :span="3" style="text-align: right">
            <el-button type="success" size="small" @click="changeCarrier('driver')">
              <icon-svg name="选择" style="vertical-align: middle"></icon-svg>
              选择</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-row style="margin-top: 20px;text-align: right">
        <el-col>
          <el-form-item>
            <el-button @click="$router.push({name: 'trans-resources-delegate-record/record-list'})">关闭</el-button>
            <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <record-module v-if="moduleVisible" ref="recordModule"></record-module>
    <carrier-info  v-if="carrierVisible" ref="carrierInfo" @getParams="receiveParams"></carrier-info>
    <car-info  v-if="carVisible" ref="carInfo" @getParams="receiveParams"></car-info>
    <driver-info  v-if="driverVisible" ref="driverInfo" @getParams="receiveParams"></driver-info>
  </div>
</template>

<script>
  import { formatDate } from '@/utils'
  import RecordModule from '../delegate/record-module'
  import CarrierInfo from '../delegate/carrierInfo'
  import CarInfo from '../delegate/carInfo'
  import DriverInfo from '../delegate/driverInfo'
  export default {
    data () {
      return {
        visible: false,
        clickFlag: true,
        dataStatus: false,
        dataForm: {
          id: '',
          recordName: '',
          consignorId: '',
          supportRange: '',
          recordDtm: '',
          effectDtm: '',
          ownerName: '',
          car: '',
          driver: '',
          carrierName: '',
          carrierIds: [],
          carNumber: '',
          carIds: [],
          driverName: '',
          driverIds: [],
          remark: ''
        },
        carriers: [],
        cars: [],
        drivers: [],
        dataRule: {
          recordName: [
            {required: true, message: '请填写备案名称', trigger: 'blur'}
          ],
          consignorId: [
            { required: true, message: '请选择委托方名称', trigger: 'change' }
          ],
          supportRange: [
            {required: true, message: '请填写适用范围', trigger: 'blur'}
          ],
          recordDtm: [
            { required: true, message: '请选择备案时间', trigger: 'change' }
          ],
          effectDtm: [
            {required: true, message: '请选择生效时间', trigger: 'blur'}
          ],
          carrierName: [
            { required: true, message: '请选择承运商', trigger: 'change' }
          ]
        },
        moduleVisible: false,
        carrierVisible: false,
        carVisible: false,
        driverVisible: false
      }
    },
    components: {
      CarrierInfo,
      CarInfo,
      DriverInfo,
      RecordModule
    },
    watch: {
      'dataForm.carrierName' (newVal, oldVal) {
        if (oldVal) {
          this.dataForm.carNumber = ''
          this.dataForm.driverName = ''
          this.dataForm.carIds = []
          this.dataForm.driverIds = []
        }
      }
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
              url: this.$http.adornUrl(`/transresources/trrecord/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.recordNo = data.tTrRecord.recordNo
                this.dataForm.consignorId = data.tTrRecord.consignorId
                this.dataForm.recordName = data.tTrRecord.recordName
                this.dataForm.carrierId = data.tTrRecord.carrierId
                // this.dataForm.effectDtm = data.tTrRecord.effectDtm
                this.dataForm.recordDtm = data.tTrRecord.recordDtm
                this.dataForm.contractAttachment = data.tTrRecord.contractFileList
                this.dataForm.remark = data.tTrRecord.remark
                this.dataForm.supportRange = data.tTrRecord.supportRange
                this.dataForm.carrierIds = data.tTrRecord.trRecordEntityMap[0] ? data.tTrRecord.trRecordEntityMap[0].map(res => {
                  return res.resourceId
                }) : []
                this.carriers = data.tTrRecord.trRecordEntityMap[0] ? data.tTrRecord.trRecordEntityMap[0] : []
                this.dataForm.carrierName = data.tTrRecord.trRecordEntityMap[0] ? data.tTrRecord.trRecordEntityMap[0].map(res => {
                  return res.resourceName
                }).join('、') : ''
                this.dataForm.carIds = data.tTrRecord.trRecordEntityMap[1] ? data.tTrRecord.trRecordEntityMap[1].map(res => {
                  return res.resourceId
                }) : []
                this.cars = data.tTrRecord.trRecordEntityMap[1] ? data.tTrRecord.trRecordEntityMap[1] : []
                this.dataForm.carNumber = data.tTrRecord.trRecordEntityMap[1] ? data.tTrRecord.trRecordEntityMap[1].map(res => {
                  return res.resourceName
                }).join('、') : ''
                this.dataForm.driverIds = data.tTrRecord.trRecordEntityMap[2] ? data.tTrRecord.trRecordEntityMap[2].map(res => {
                  return res.resourceId
                }) : []
                this.drivers = data.tTrRecord.trRecordEntityMap[2] ? data.tTrRecord.trRecordEntityMap[2] : []
                this.dataForm.driverName = data.tTrRecord.trRecordEntityMap[2] ? data.tTrRecord.trRecordEntityMap[2].map(res => {
                  return res.resourceName
                }).join('、') : ''
              }
            })
          } else {
            this.isDisabled = false
            this.dataForm.attachmentUrl = ''
          }
        })
      },
      chooseModule () {
        this.moduleVisible = true
        this.$nextTick(() => {
          this.$refs.recordModule.init()
        })
      },
      // 选择弹框
      changeCarrier (type) {
        if (type === 'carrier') {
          this.carrierVisible = true
          this.carriers = this.carriers.map(res => {
            if (res.resourceName) {
              res.carrierName = res.resourceName
            }
            return res
          })
          this.$nextTick(() => {
            this.$refs.carrierInfo.init(this.dataForm.carrierIds, this.carriers)
          })
        } else if (type === 'car') {
          if (!this.dataForm.carrierName) {
            this.$message({
              type: 'warning',
              message: '请先选择承运商'
            })
            return false
          }
          this.cars = this.cars.map(res => {
            if (res.resourceName) {
              res.carNumber = res.resourceName
            }
            return res
          })
          this.carVisible = true
          this.$nextTick(() => {
            this.$refs.carInfo.init(this.dataForm.carrierIds, this.dataForm.carIds, this.cars)
          })
        } else if (type === 'driver') {
          if (!this.dataForm.carrierName) {
            this.$message({
              type: 'warning',
              message: '请先选择承运商'
            })
            return false
          }
          this.drivers = this.drivers.map(res => {
            if (res.resourceName) {
              res.driverName = res.resourceName
            }
            return res
          })
          this.driverVisible = true
          this.$nextTick(() => {
            this.$refs.driverInfo.init(this.dataForm.carrierIds, this.dataForm.driverIds, this.drivers)
          })
        }
      },
      receiveParams (params, type) {
        if (type === 'carrier') {
          this.carriers = params
          this.dataForm.carrierName = params.map(res => {
            return res.carrierName
          })
          this.dataForm.carrierIds = params.map(res => {
            return res.id
          })
          this.dataForm.carrierName = this.dataForm.carrierName.join('、')
        } else if (type === 'car') {
          this.cars = params
          this.dataForm.carNumber = params.map(res => {
            return res.carNumber
          })
          this.dataForm.carIds = params.map(res => {
            return res.id
          })
          this.dataForm.carNumber = this.dataForm.carNumber.join('、')
        } else {
          this.drivers = params
          this.dataForm.driverName = params.map(res => {
            return res.driverName
          })
          this.dataForm.driverIds = params.map(res => {
            return res.id
          })
          this.dataForm.driverName = this.dataForm.driverName.join('、')
        }
      },
      handleCancel () {
        window.history.go(-1)
      },
      verifyRecordName () {
        if (this.dataForm.recordName === this.originalName) {
          return;
        }
        this.$http({
          url: this.$http.adornUrl('/transresources/trrecord/findByRecordName'),
          method: 'post',
          data: this.$http.adornData({
            'recordName': this.dataForm.recordName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataStatus = true
          } else {
            if (this.getFlag) {
              this.dataStatus = false
            } else {
              this.getFlag = true
              this.dataForm.userName = this.originalName
              this.dataForm.password = ''
            }
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.clickFlag) {
              return;
            }
            this.clickFlag = false
            this.$http({
              url: this.$http.adornUrl(`/transresources/trrecord/${!this.dataForm.id ? 'saveList' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                ...this.dataForm,
                'recordDtm': formatDate(this.dataForm.recordDtm),
                // 'effectDtm': formatDate(this.dataForm.effectDtm),
                'recordDetailList': {
                  0: this.dataForm.carrierIds,
                  1: this.dataForm.carIds,
                  2: this.dataForm.driverIds
                }
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.$router.push({name: 'trans-resources-delegate-record/record-list'})
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
      downloadFiles () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.clickFlag) {
              return;
            }
            this.clickFlag = false
            this.$http({
              url: this.$http.adornUrl(`/transresources/ttrconsignor/downloadFilsList`),
              method: 'post',
              data: this.$http.adornData({
                id: this.dataForm.id,
                effectDtm: formatDate(this.dataForm.effectDtm),
                recordDtm: formatDate(this.dataForm.recordDtm),
                recordDetailList: {
                  0: this.dataForm.carrierIds,
                  1: this.dataForm.carIds,
                  2: this.dataForm.driverIds
                }
              }),
              responseType: 'blob'
            }).then(({data}) => {
              this.loading = false
              const link = document.createElement('a')
              let blob = new Blob([data], {type: 'application/octet-stream'});
              if (blob.size === 0 || blob.size === 54) {
                this.$message.error('文件不存在')
                return
              }
              // let fileName = new Date().getTime()
              let fileName = this.dataForm.ownerName + formatDate(new Date()) + '.zip'
              // for IE
              if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, fileName);
              } else {
                // for Non-IE (chrome, firefox etc.)
                link.style.display = 'none'
                link.href = URL.createObjectURL(blob);
                link.setAttribute('download', fileName)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .tem-content{
    /*width: 75%;*/
    /*margin: 0 auto;*/
  }
</style>
