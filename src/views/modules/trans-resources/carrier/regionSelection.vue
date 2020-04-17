<template>
  <el-dialog
    title="区域选择"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%">
    <div class="shuttle">
      <div class="shuttle_item">
        <span>所有区域</span>
        <ul class="school">
          <el-input placeholder="请输入" v-model="inputVal" size="mini" clearable style="margin-top: 10px" @change="handleSearch()">
          </el-input>
          <li v-for="(item,index) in allArea" :key="index">
            <input type="checkbox" :id="item.id" :value="item.id"
                   v-model="schoolsNames"
                   :disabled="teamName.length>0||teamLeader.length>0?true:false"
            >
            <label :for="item.id">{{item.name}}</label>
          </li>
        </ul>
      </div>
      <div class="shuttle_arrow">
        <el-button icon="el-icon-d-arrow-right" type="primary" plain @click="toRightTeam"
                   :disabled="schoolsNames.length==0?true:false">
        </el-button>
        <el-button icon="el-icon-d-arrow-left" type="primary" plain class="go_left"
                   :disabled="teamName.length==0?true:false" @click="toLeftSchools">
        </el-button>
      </div>
      <div class="shuttle_item">
        <span>已选区域</span>
        <ul class="school">
          <li v-for="(item ,index ) in areaList" :key="index">
            <input type="checkbox" :id="item.id" :value="item.id"
                   v-model="teamName"
                   :disabled="schoolsNames.length>0||teamLeader.length>0?true:false"
            >
            <label :for="item.id">{{item.name}}</label>
          </li>
        </ul>
      </div>
      <div class="shuttle_arrow">
        <el-button icon="el-icon-d-arrow-right" type="primary" plain
                   :disabled="teamName.length==0?true:false"
                   @click="toRightLeader"
        >
        </el-button>
        <el-button icon="el-icon-d-arrow-left" type="primary" plain class="go_left"
                   :disabled="teamLeader.length==0?true:false"
                   @click="toLeftTeam"
        >
        </el-button>
      </div>
      <div class="shuttle_item">
        <span>优势区域</span>
        <ul class="school">
          <li v-for="(item,index) in goodArea" :key="index">
            <input type="checkbox" :id="item.id" :value="item.id"
                   v-model="teamLeader"
                   :disabled="schoolsNames.length>0||teamName.length>0?true:false"
            >
            <label :for="item.id">{{item.name}}</label>
          </li>
        </ul>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="putParentsTeams()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        inputVal: '',
        pageIndex: 1,
        visible: false,
        allArea: [],
        allAreaList: [],
        areaList: [],
        goodArea: [],
        schoolsNames: [],
        teamName: [],
        teamLeader: [],
        schoolInfo: '',
        teamInfo: '',
        leaderInfo: ''
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
    methods: {
      handleSearch () {
        const areaList = this.areaList
        const goodArea = this.goodArea
        const otherArea = areaList.concat(goodArea)
        let currentArea = [].concat(this.allAreaList)
        if (otherArea.length > 0) {
          for (let i = 0; i < otherArea.length; i++) {
            const item = otherArea[i]
            for (let j = 0; j < currentArea.length; j++) {
              const item2 = currentArea[j]
              if (item.name === item2.name) {
                currentArea.splice(j, 1)
              }
            }
          }
        }
        this.allArea = [].concat(currentArea)
        if ((this.inputVal).trim()) {
          const searhList = this.allArea.filter(item => item.name.indexOf(this.inputVal) > -1)
          this.allArea = searhList
        } else {
          this.allArea = this.allArea
        }
      },
      init () {
        this.visible = true
        this.inputVal = ''
        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/sysregion/noPowerList'),
            method: 'post',
            data: this.$http.adornData({
              'page': this.pageIndex,
              'limit': 999,
              'status': 0,
              'type': undefined,
              'level': 1
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.allArea = data.page.list;
              this.allAreaList = [].concat(data.page.list);
            } else {
            }
          })
        })
      },
      async toRightTeam () {
        this.inputVal = ''
        this.handleSearch()
        let moveName = await this.matching(this.allArea, this.schoolsNames)
        let allArr = await this.myFilter(this.allArea, moveName)
        this.allArea = allArr
        for (let i = 0; i < moveName.length; i++) {
          this.areaList.push(moveName[i])
        }
        this.schoolsNames = []
        // await this.putParentsTeams()
      },
      async toLeftSchools () {
        this.inputVal = ''
        this.handleSearch()
        let moveName = await this.matching(this.areaList, this.teamName)
        let allArr = await this.myFilter(this.areaList, moveName)
        this.areaList = allArr
        for (let i = 0; i < moveName.length; i++) {
          this.allArea.push(moveName[i])
        }
        this.teamName = [];
        // await this.putParentsTeams()
      },
      async toRightLeader () {
        let moveName = await this.matching(this.areaList, this.teamName)
        let allArr = await this.myFilter(this.areaList, moveName)
        this.areaList = allArr
        for (let i = 0; i < moveName.length; i++) {
          this.goodArea.push(moveName[i])
        }
        this.teamName = []
        // await this.putParentsTeams()
      },
      async toLeftTeam () {
        let moveName = await this.matching(this.goodArea, this.teamLeader)
        let allArr = await this.myFilter(this.goodArea, moveName)
        this.goodArea = allArr;
        for (let i = 0;  i < moveName.length; i++) {
          this.areaList.push(moveName[i])
        }
        this.teamLeader = [];
        // await this.putParentsTeams()
      },
      // 过滤 相同选项
      async myFilter (allArr, selArr) {
        for (let i = 0; i < allArr.length; i++) {
          for (let j = 0; j < selArr.length; j++) {
            if (allArr[i].id === selArr[j].id) {
              allArr.splice(i, 1)
            }
          }
        }
        return allArr;
      },
      //  匹配 移动的 选项
      async matching (allArr, matchArr) {
        let matArr = [];
        for (let i = 0; i < allArr.length; i++) {
          for (let j = 0; j < matchArr.length; j++) {
            if (allArr[i].id === matchArr[j]) {
              matArr.push(allArr[i])
            }
          }
        }
        return matArr;
      },
      //    向父组件传组员名称 和组长id   由于这是单独的一个穿梭框组件，数据会和父组件里面的动态绑定，提交按钮也在父组件，所以需要此步骤，
      async putParentsTeams () {
        this.$emit('areaList', this.areaList, this.goodArea)
        this.visible = false
      }
    }
  }
</script>

<style lang="scss" scoped>
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
