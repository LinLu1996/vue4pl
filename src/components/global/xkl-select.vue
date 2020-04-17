<template>
  <el-select
    :loading="loading"
    class="selectBar"
    v-model="data"
    v-bind='$attrs'
    v-on="$listeners"
    :filterable="filterable"
    :multiple="multiples"
    clearable
    remote
    :remote-method="remoteMethod"
    @focus="selectBlur"
  >
    <el-option
      v-for="item in dataList"
      :key="item[$attrs.keyType] || item.dicKey || item.id"
      :label="item[$attrs.labelType] || item.dicValue || item.shortName"
      :value="item[$attrs.keyType] || item.dicKey || item.id"
      @click.native="sendLabel(item[$attrs.labelType] || item.dicValue || item.shortName), sendItem(item)">
    </el-option>
    <div v-if="filterable && false" style="height: 30px;"></div>
    <div class="pageWrap" v-if="filterable && false">
      <el-pagination
        background
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        :total="totalPage"
        layout="prev, next">
      </el-pagination>
    </div>
  </el-select>
</template>
<script>
export default {
  name: 'xklSelect',
  props: {
    value: {
      required: true
    },
    selectType: {
      require: true,
      type: String
    },
    linkage: {
      type: String
    },
    multiple: {
      type: Boolean
    },
    level: {
      type: Number
    }
  },
  data () {
    return {
      dataList: [],
      dataForm: {
        type: 1
      },
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      filterable: false,
      multiples: false,
      readOnlys: false,
      loading: false,
      levels: 0
    }
  },
  watch: {
    value (newVal, oldVal) {
      if (newVal !== '' && typeof (newVal) === 'number') {
        this.selectBlur()
      }
    }
  },
  created () {
    this.linkage ? this.filterable = true : this.filterable = false
    this.multiple ? this.multiples = true : this.multiples = false
    this.level ? this.levels = this.level : this.levels = 0
    this.selectBlur()
  },
  methods: {
    selectBlur () {
      if ((this.linkage !== '' && this.linkage !== undefined) || this.selectType) {
        this.pageIndex = 1
        this.getDataList()
      } else {
        this.dataList = []
      }
    },
    getDataList (query) {
      this.dataListLoading = true
      this.dataList = []
      this.$http({
        url: this.$http.adornUrl(this.linkage ? this.linkage : '/sys/dictionary/noPowerList'),
        method: 'post',
        data: this.$http.adornData({
          'page': this.pageIndex,
          // 'limit': this.linkage ? this.pageSize : 999,
          'limit': 999,
          'status': 0,
          'type': this.linkage ? undefined : this.selectType,
          'belongCompany': this.$attrs.companyId || undefined,
          [this.$attrs.labelType]: this.linkage ? query : undefined,
          'level': this.levels ? this.levels : 1,
          'id': this.$attrs.selectId || undefined,
          'levelProNumber': this.$attrs.levelNumber1 || undefined,
          'levelCityNumber': this.$attrs.levelNumber2 || undefined,
          'levelAreaNumber': this.$attrs.levelNumber3 || undefined,
          'parentId': this.$attrs.parentId || undefined,
          'assessmentClassificationLevel': this.$attrs.assessmentClassificationLevel || undefined,
          'assessmentProjectLevel': this.$attrs.assessmentProjectLevel || undefined,
          'assessmentStandardLevel': this.$attrs.assessmentStandardLevel || undefined,
          'coolerBrand': this.$attrs.coolerBrand || undefined,
          'transportId': this.$attrs.transportId || undefined,
          'managementId': this.$attrs.managementId || undefined,
          'projectKpiId': this.$attrs.projectKpiId || undefined,
          'transportType': this.$attrs.transportType || undefined,
          'projectType': this.$attrs.projectType || undefined,
          'recordId': this.$attrs.recordId || undefined
        })
      }).then(({data}) => {
        if (data && data.code === 0 && data.page) {
          this.dataList = data.page.list;
          // this.$store.commit('dict/updateList', this.dataList)
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.loading = false
      })
    },
    currentChangeHandle (val) {
      this.data = ''
      this.pageIndex = val
      this.getDataList()
    },
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    remoteMethod (query) {
      this.loading = true
      this.getDataList(query)
    },
    sendLabel (label) {
      this.$nextTick(() => {
        this.$emit('getLabel', label)
      })
    },
    sendItem (item) {
      this.$nextTick(() => {
        this.$emit('getItem', item)
      })
    }
  },
  computed: {
    // getDict () {
    //   return this.$store.state.dict.list
    // }
    data: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .pageWrap{
    width: 100%;
    position: absolute;
    bottom: 0;
    background-color: #ffffff;
    /deep/.el-pagination{
      display: flex;
      justify-content: space-around;
      padding: 0;
      button{
        width: 50%;
        background: none;
        margin: 0;
        &:hover{
          background-color: rgba(240,240,240,0.3);
        }
      }
    }
  }
</style>
