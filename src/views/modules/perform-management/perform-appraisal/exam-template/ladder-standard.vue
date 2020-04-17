<template>
  <el-dialog
    title="阶梯标准"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :before-close="closeForm"
    width="60%"
  >
    <el-form label-width="100px" style="min-height: 250px" label-position="top" ref="dataForm" :model="dataForm">
      <el-row>
        <el-col :span="4" :offset="1">
          <span style="padding: 10px 0;display: block">百分比起始：</span>
        </el-col>
        <el-col :span="4" :offset="2">
          <span style="padding: 10px 0;display: block">百分比结尾：</span>
        </el-col>
        <el-col :span="4" :offset="1">
          <span style="padding: 10px 0;display: block">权重分：</span>
        </el-col>
        <el-col :span="4" :offset="1">
          <el-button type="primary" size="mini" @click="addOrDelStandard(1)">新增</el-button>
        </el-col>
      </el-row>
      <div v-if="!dataForm.tempData.length" style="font-size: 40px; text-align: center;color: #eeeeee;height: 200px;line-height: 200px">暂未建立阶梯标准</div>
      <el-row v-else v-for="(item, index) in dataForm.tempData" :key="index">
        <el-col :span="4" :offset="1">
          <el-form-item :prop="'tempData.'+ index +'.percentStandardStart'" :rules="dataRule.percentStandardStart">
            <el-input v-model="item.percentStandardStart" @blur="checkData(item, 'start')" maxLength="5">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" :offset="2">
          <el-form-item :prop="'tempData.'+ index +'.percentStandardEnd'" :rules="dataRule.percentStandardEnd">
            <el-input v-model="item.percentStandardEnd" @blur="checkData(item, 'end')" maxLength="5">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" :offset="1">
          <el-form-item :prop="'tempData.'+ index +'.weightScore'" :rules="dataRule.weightScore">
            <el-input v-model="item.weightScore" @blur="checkData(item, 'weightScore')" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-form-item>
            <el-button type="danger" size="mini" @click="addOrDelStandard(0, index)">删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeForm()">关闭</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      ladderStandard: {
        type: Array
      }
    },
    data () {
      let verifyPositiveNumber = (rule, value, callback) => {
        if (value === '' || value == null) {
          callback(new Error('请输入分值'))
        }
        if (isNaN(value) || value < 0 || value > 100) {
          callback(new Error('请输入0 - 100之间数字'))
        }
        callback()
      }
      let verifyNumber = (rule, value, callback) => {
        if (value === '' || value == null) {
          callback(new Error('请输入分值'))
        }
        if (isNaN(value) || value < 0) {
          callback(new Error('请输入大于等于0的数字'))
        }
        if (value.toString().split('.')[0] && value.toString().split('.')[0].length > 3) {
          callback(new Error('最多输入3位整数'))
        }
        if (value.toString().split('.')[1] && value.toString().split('.')[1].length > 2) {
          callback(new Error('最多保留2位小数'))
        }
        callback()
      }
      return {
        visible: false,
        dataForm: {
          id: 0,
          tempData: []
        },
        tempAdd: [],
        tempDelete: [],
        dataForClose: [],
        dataRule: {
          percentStandardStart: [
            { validator: verifyPositiveNumber, trigger: 'change' }
          ],
          percentStandardEnd: [
            { validator: verifyPositiveNumber, trigger: 'change' }
          ],
          weightScore: [
            { validator: verifyNumber, trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
    },
    components: {
    },
    created () {
    },
    methods: {
      init (item) {
        this.tempAdd = []
        this.tempDelete = []
        this.dataForClose = []
        this.visible = true
        this.dataForm.id = item.assessmentStandard
        this.dataForm.tempData = this.ladderStandard.filter(res => {
          return res.templateRelationId === item.assessmentStandard && res.percentStandardStart !== '' && !isNaN(res.percentStandardStart)
        })
        if (item.percentStandard && !this.dataForm.tempData.length) {
          let json = {
            templateRelationId: this.dataForm.id,
            percentStandardStart: item.percentStandard,
            percentStandardEnd: '100',
            weightScore: ''
          }
          this.dataForm.tempData.push(json)
          this.tempAdd.push(json)
        }
        this.dataForm.tempData.forEach(res => {
          let json = {...res}
          this.dataForClose.push(json)
        })
      },
      addOrDelStandard (type, index) {
        if (type === 1) {
          let item = {
            templateRelationId: this.dataForm.id,
            percentStandardStart: '',
            percentStandardEnd: '',
            weightScore: ''
          }
          this.dataForm.tempData.push(item)
          this.tempAdd.push(item)
        } else {
          let pop = this.dataForm.tempData.splice(index, 1)
          this.tempDelete = this.tempDelete.concat(pop)
        }
      },
      checkData (item, type) {
        if (type === 'weightScore' && this.dataForm.tempData.length > 1) {
          let weightFlag = this.dataForm.tempData.map(res => parseFloat(res.weightScore)).filter(res => !isNaN(res))
          let weightSet = new Set(weightFlag)
          if (weightFlag.length !== weightSet.size) {
            this.$message.warning('该分值已存在')
            item.weightScore = ''
          }
        }
        if (type === 'start') {
          let tmpStart = this.dataForm.tempData.filter(res => res.percentStandardStart).map(res => parseFloat(res.percentStandardStart))
          let tmpSet = new Set(tmpStart)
          this.tempFlag = tmpSet.size !== tmpStart.length || this.dataForm.tempData.find(res => {
            return parseFloat(res.percentStandardStart) < parseFloat(item.percentStandardStart) && parseFloat(item.percentStandardStart) < parseFloat(res.percentStandardEnd)
          })
        } else {
          let tmpEnd = this.dataForm.tempData.filter(res => res.percentStandardEnd).map(res => parseFloat(res.percentStandardEnd))
          let tmpSet = new Set(tmpEnd)
          this.tempFlag = tmpSet.size !== tmpEnd.length || this.dataForm.tempData.find(res => {
            return parseFloat(res.percentStandardStart) < parseFloat(item.percentStandardEnd) && parseFloat(item.percentStandardEnd) < parseFloat(res.percentStandardEnd)
          })
        }
        this.tempFlagFull = this.dataForm.tempData.find(res => {
          return parseFloat(res.percentStandardStart) > parseFloat(item.percentStandardStart) && parseFloat(item.percentStandardEnd) > parseFloat(res.percentStandardEnd)
        })
        if (this.tempFlag) {
          this.$message({
            type: 'warning',
            message: '存在重叠区间'
          })
          if (type === 'start') {
            item.percentStandardStart = ''
          } else {
            item.percentStandardEnd = ''
          }
        }
        if (this.tempFlagFull) {
          this.$message({
            type: 'warning',
            message: '存在重叠区间'
          })
          item.percentStandardStart = ''
          item.percentStandardEnd = ''
        }
        if (parseFloat(item.percentStandardStart) > parseFloat(item.percentStandardEnd)) {
          this.$message({
            type: 'warning',
            message: '区间不合法'
          })
          item.percentStandardStart = ''
          item.percentStandardEnd = ''
        }
      },
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.tempAdd = this.tempAdd.map(res => {
              res.percentStandardStart = parseFloat(res.percentStandardStart)
              res.percentStandardEnd = parseFloat(res.percentStandardEnd)
              res.weightScore = parseFloat(res.weightScore)
              return res
            })
            this.ladderStandard.push(...this.tempAdd)
            if (this.tempDelete.length) {
              let tempStart = this.tempDelete.map(res => res.percentStandardStart)
              for (let i = this.ladderStandard.length - 1; i >= 0; i--) { // 倒着删除splice才能删除全部
                if (tempStart.indexOf(this.ladderStandard[i].percentStandardStart) > -1 && this.ladderStandard[i].templateRelationId === this.dataForm.id) {
                  this.ladderStandard.splice(i, 1);
                }
              }
            }
            this.visible = false
          }
        })
      },
      closeForm () {
        for (let i = this.ladderStandard.length - 1; i >= 0; i--) { // 倒着删除splice才能删除全部
          if (this.ladderStandard[i].templateRelationId === this.dataForm.id) {
            this.ladderStandard.splice(i, 1);
          }
        }
        let reId = this.dataForClose.map(res => {
          return res.templateRelationId
        })[0]
        if (reId === this.dataForm.id) {
          let pushFlag = this.ladderStandard.some(res => res.templateRelationId === this.dataForm.id)
          if (!pushFlag) {
            this.ladderStandard.push(...this.dataForClose)
          }
        }
        this.visible = false
        this.$refs['dataForm'].clearValidate()
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
  /deep/.el-dialog__wrapper .el-form-item__content .el-upload--picture-card{
    display: none;
  }
  /deep/.el-dialog__wrapper .el-upload__tip{
    display: none;
  }
</style>
