<template>
  <el-row>
    <el-col :span="4">
      <el-popover
        placement="bottom"
        width="300"
        v-model="able"
        trigger="click">
        <div>
          <el-button v-for="item in carNumberPres" :key="item.id"  type="text" style="color: #333333" @click="setPreAddress(item.plateArea)">{{ item.plateArea }}</el-button>
        </div>
        <el-button slot="reference" @click="getPreAddress()" style="width: 100%; padding: 10px 2px">{{carNumberPre}}</el-button>
      </el-popover>
    </el-col>
    <el-col :span="20" style="padding-left: 5px">
      <el-input style="width: 100%"  v-model="data" placeholder="车牌号" clearable maxlength="20"></el-input>
    </el-col>
  </el-row>
</template>
<script>
  export default {
    name: 'xklCarNumber',
    props: {
      value: {
        required: true
      }
    },
    data () {
      return {
        carNumber: '',
        carNumberPre: '沪',
        carNumberPres: [],
        able: false
      }
    },
    methods: {
      init (carNumberPre) {
        this.carNumberPre = carNumberPre
      },
      getPreAddress () {
        this.$http({
          url: this.$http.adornUrl('/sys/sysregion/plateAreaList'),
          method: 'post',
          data: this.$http.adornData({
            'page': 1,
            'limit': 999
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.carNumberPres = data.page.list;
            this.totalPage = data.page.totalCount
          } else {
            this.carNumberPres = []
            this.totalPage = 0
          }
          this.loading = false
        })
      },
      setPreAddress (area) {
        this.carNumberPre = area
        this.$emit('areaPre', this.carNumberPre)
        this.able = false
      }
    },
    computed: {
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
