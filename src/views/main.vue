<template>
  <div>
    <div
      v-if="nestingShow"
      class="site-wrapper"
      :class="{ 'site-sidebar--fold': sidebarFold }"
      v-loading.fullscreen.lock="loading"
      element-loading-text="拼命加载中">
      <template v-if="!loading">
        <main-navbar />
        <main-sidebar />
        <div class="site-content__wrapper" :style="{ 'min-height': documentClientHeight + 'px' }">
          <main-content v-if="!$store.state.common.contentIsNeedRefresh" />
        </div>
      </template>
    </div>
    <div style="padding: 20px" v-else>
      <vehicel v-if="$route.name === 'trans-management-vehicel/vehicel-support-rate'"/>
      <train v-if="$route.name === 'trans-management-train/train-list'"/>
      <temperature v-if="$route.name === 'trans-management-temperature-return/temperature-return-timeliness'"/>
      <service v-if="$route.name === 'trans-management-service-quality/service-quality'"/>
      <safe v-if="$route.name === 'trans-management-safe-arrival/safe-arrival'"/>
      <customer v-if="$route.name === 'trans-management-customer-complaint/customer-complaint'"/>
      <accidental v-if="$route.name === 'trans-management-accidental-injury/accidental-injury'"/>
    </div>
  </div>
</template>

<script>
  import MainNavbar from './main-navbar'
  import MainSidebar from './main-sidebar'
  import MainContent from './main-content'
  import Vehicel from './modules/trans-management/vehicel/vehicel-support-rate'
  import Train from './modules/trans-management/train/train-list'
  import Temperature from './modules/trans-management/temperature-return/temperature-return-timeliness'
  import Service from './modules/trans-management/service-quality/service-quality'
  import Safe from './modules/trans-management/safe-arrival/safe-arrival'
  import Customer from './modules/trans-management/customer-complaint/customer-complaint'
  import Accidental from './modules/trans-management/accidental-injury/accidental-injury'
  export default {
    provide () {
      return {
        // 刷新
        refresh () {
          this.$store.commit('common/updateContentIsNeedRefresh', true)
          this.$nextTick(() => {
            this.$store.commit('common/updateContentIsNeedRefresh', false)
          })
        }
      }
    },
    data () {
      return {
        loading: true,
        nestingShow: true
      }
    },
    components: {
      MainNavbar,
      MainSidebar,
      MainContent,
      Vehicel,
      Train,
      Temperature,
      Service,
      Safe,
      Customer,
      Accidental
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight },
        set (val) { this.$store.commit('common/updateDocumentClientHeight', val) }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold }
      },
      userId: {
        get () { return this.$store.state.user.id },
        set (val) { this.$store.commit('user/updateId', val) }
      },
      userName: {
        get () { return this.$store.state.user.name },
        set (val) { this.$store.commit('user/updateName', val) }
      },
      realName: {
        get () { return this.$store.state.user.realName },
        set (val) { this.$store.commit('user/updateRealName', val) }
      }
    },
    created () {
      this.getUserInfo()
      this.handleNestingStaus()
    },
    mounted () {
      this.resetDocumentClientHeight()
      if (this.$cookie.get('token2')) this.$store.commit('user/getToken', this.$cookie.get('token2'))
    },
    methods: {
      // 重置窗口可视高度
      resetDocumentClientHeight () {
        this.documentClientHeight = document.documentElement['clientHeight']
        window.onresize = () => {
          this.documentClientHeight = document.documentElement['clientHeight']
        }
      },
      // 获取当前管理员信息
      getUserInfo () {
        this.$http({
          url: this.$http.adornUrl('/sys/user/info'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.loading = false
            this.userId = data.user.userId
            this.userName = data.user.userName
            this.realName = data.user.realName
          }
        })
      },
      handleNestingStaus () {
        if (this.$route.query.token) {
          this.nestingShow = false
        } else {
          this.nestingShow = true
        }
      }
    }
  }
</script>
