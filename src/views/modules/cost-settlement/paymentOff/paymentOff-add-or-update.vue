<template>
  <el-dialog
    title="核销信息"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="90px">
      <el-form-item label="承运商名称" prop="carrierName">
        <el-input v-model="dataForm.carrierName" maxlength="100" placeholder="承运商名称"></el-input>
      </el-form-item>
      <el-form-item label="开票日期" prop="address">
        <el-date-picker
          style="width: 100%;"
          v-model="dataForm.time"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="账期截止期" prop="address">
        <el-date-picker
          style="width: 100%;"
          v-model="dataForm.time"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="开票金额" prop="carrierName">
        <el-input v-model="dataForm.carrierName"></el-input>
      </el-form-item>
      <el-form-item label="未付金额" prop="carrierName">
        <el-input v-model="dataForm.carrierName"></el-input>
      </el-form-item>
      <el-form-item label="付款金额" prop="carrierName">
        <el-input v-model="dataForm.carrierName"></el-input>
      </el-form-item>
      <el-form-item label="付款日期" prop="address">
        <el-date-picker
          style="width: 100%;"
          v-model="dataForm.time"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <template>
      <el-table
        :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
        :data="dataList"
        border
        v-loading="dataListLoading"
        style="width: 100%;">
        <el-table-column
          type="index"
          width="60"
          align="center"
          label="No.">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="付款日期">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="付款金额">
        </el-table-column>
      </el-table>
    </template>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="dataFormSubmit()">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        clickFlag: true,
        options: [],
        roadList: [
          {
            startRoad: '',
            endRoad: ''
          }
        ],
        dataForm: {
          id: 0,
          carrierCode: '',
          carrierName: '',
          address: '',
          phone: '',
          corporation: '',
          link: '',
          linkPhone: '',
          goodAreaId: [],
          startRoad: null,
          endRoad: null,
          regCapital: 0,
          carrierTpmodes: [],
          temperatureRange: [],
          linkMail: '',
          introductionWay: '',
          isEnabled: 0,
          idcard: ''
        },
        tableList: [
          {
            type: 1,
            photo: '',
            time: ''
          },
          {
            type: 1,
            photo: '',
            time: ''
          }
        ],
        dialogVisible: false,
        dialogImageUrl: '',
        dataRule: {}
      }
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
              url: this.$http.adornUrl(`/sys/config/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              // if (data && data.code === 0) {
              //   this.dataForm.paramKey = data.config.paramKey
              //   this.dataForm.paramValue = data.config.paramValue
              //   this.dataForm.remark = data.config.remark
              // }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        const _this = this;
        const newRoad = [];
        for (let i = 0; i < _this.roadList.length; i++) {
          const item = _this.roadList[i];
          const newItem = {};
          if (item.startRoad !== '') {
            newItem.startRoad = item.startRoad
          }
          if (item.endRoad !== '') {
            newItem.endRoad = item.endRoad
          }
          if (Object.keys(newItem).length > 0) {
            newRoad.push(newItem)
          }
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.clickFlag) {
              return;
            }
            this.clickFlag = false
            this.$http({
              url: this.$http.adornUrl(`/sys/config/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'paramKey': this.dataForm.paramKey,
                'paramValue': this.dataForm.paramValue,
                'remark': this.dataForm.remark
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
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
<style lang="scss">

</style>
