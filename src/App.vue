<template>
  <transition name="fade">
    <router-view></router-view>
  </transition>
</template>

<script>
  export default {
  }
</script>
<style lang="scss">
  body .el-table th.gutter {
    display: table-cell!important;
  }
  body .el-table colgroup.gutter {
    display: table-cell ! important;
  }
  body .el-table::before {
    z-index: inherit;
  }
  .el-table__body tr:hover>td{
    background-color: #9dcae3!important;
  }

  .el-table__body tr.current-row>td{
    background-color: #9dcae3!important;
  }
  .el-table__header-wrapper{
    /*height: 40px;*/
    .is-leaf{
      padding: 3px;
    }
  }
  .el-table__fixed-header-wrapper{
    tr{
      th{
        padding: 3px!important;
      }
    }
  }
  .el-table__body-wrapper, .el-table__fixed-body-wrapper{
    .el-table__row{
      td{
        padding: 4px;
      }
    }
    button{
      height: 25px;
      line-height: 25px;
      padding: 0;
      text-align: center;
      background: none;
      color: #3E8EF7;
      border: none;
      &:hover{
        padding: 0 5px;
      }
    }
  }
  .el-table .caret-wrapper{
    position: absolute!important;
    top: -5px!important;
  }
  .el-table .ascending .sort-caret.ascending {
    border-bottom-color: #54ff00!important;
  }
  .el-table .descending .sort-caret.descending {
    border-top-color: #54ff00!important;
  }
  body .el-dialog__wrapper {
    .el-dialog__header {
      border-bottom: 1px solid #CCCCCC !important;
      background-color: #f5f5f5!important;
    }
    .el-dialog__footer{
      border-top: 1px solid #CCCCCC;
      background-color: #f5f5f5!important;
      padding-bottom: 10px;
    }
  }
  .el-table__fixed-right{
    height: 100%!important;
  }
  .el-select-dropdown{
    max-width: 500px!important;
  }
</style>
