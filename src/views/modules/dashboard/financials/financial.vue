<template>
  <div ref="wrap" :style="{height: '1000px'}">
    <!--<iframe ref="iframe" class="iframeItem" src="http://localhost:8001/#/dashboard-achievements/achievements" frameborder="0" width="100%" height="111%"></iframe>-->
    <iframe ref="iframe" class="iframeItem" :src="iframeUrl" frameborder="0" width="100%" height="90%"></iframe>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        iframeUrl: '',
        divWidth: '',
        divHeight: ''
      }
    },
    computed: {
      token: {
        get () { return this.$store.state.user.token }
      }
    },
    activated () {
      this.init()
    },
    methods: {
      init () {
        this.$http({
          url: this.$http.adornUrl('/sys/getOtherToken'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$cookie.set('token2', data.token)
            this.$store.commit('user/getToken', data.token);
            this.iframeUrl = `http://10.32.6.101/single/?appid=c27ec15d-f609-4326-8130-2b1f1fd34b09&sheet=ymcmq&opt=currsel&select=clearall&QlikTicket=${this.token}`
          }
        })
        this.$nextTick(() => {
          this.divWidth = this.$refs.wrap.clientWidth + 'px';
          this.divHeight = this.$refs.iframe.clientHeight + 'px';
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .iframeItem {
    position: absolute;
    width: 94%;
  }
</style>
