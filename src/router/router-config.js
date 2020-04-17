const _import = require('./import-' + process.env.NODE_ENV)
let routes = [
  { path: '/home',
    component: _import('common/home'),
    name: 'home',
    meta: { title: '首页' }
  },
  { path: '/todoList',
    component: _import('common/todoList'),
    name: 'todoList',
    meta: { title: '待办事项' }
  },
  { path: '/doList',
    component: _import('common/doList'),
    name: 'doList',
    meta: { title: '已办事项' }
  },
  { path: '/theme',
    component: _import('common/theme'),
    name: 'theme',
    meta: { title: '主题' }
  },
  { path: '/carrierAdd',
    component: _import('modules/trans-resources/carrier/carrier-add-or-update'),
    name: 'carrierAdd',
    meta: { title: '新增' }
  },
  { path: '/carrierDetail',
    component: _import('modules/trans-resources/carrier/carrier-detail'),
    name: 'carrierDetail',
    meta: { title: '详情' }
  },
  { path: '/carrierRoad',
    component: _import('modules/trans-resources/carrier/carrier-road'),
    name: 'carrierRoad',
    meta: { title: '路线' }
  },
  { path: '/carMaintenance',
    component: _import('modules/trans-resources/car/car-maintenance'),
    name: 'carMaintenance',
    meta: { title: '维保记录' }
  },
  { path: '/car/car-add-or-update',
    component: _import('modules/trans-resources/car/car-add-or-update'),
    name: 'car-add-or-update',
    meta: { title: '新增编辑' }
  },
  { path: '/contract/contract-add-or-update',
    component: _import('modules/trans-resources/contract/contract-add-or-update'),
    name: 'contract-add-or-update',
    meta: { title: '新增编辑' }
  },
  { path: '/carrier-area/area-add-or-update',
    component: _import('modules/trans-resources/carrier-area/area-add-or-update'),
    name: 'area-add-or-update',
    meta: { title: '新增编辑' }
  },
  { path: '/carrier-area/area-detail',
    component: _import('modules/trans-resources/carrier-area/area-details'),
    name: 'area-details',
    meta: { title: '详情' }
  },
  { path: '/contract/agreement-add',
    component: _import('modules/trans-resources/contract/agreement-add'),
    name: 'agreement-add',
    meta: { title: '添加补充协议' }
  },
  { path: '/contract/agreement-details',
    component: _import('modules/trans-resources/contract/agreement-details'),
    name: 'agreement-details',
    meta: { title: '补充协议详情' }
  },
  { path: '/business-license/business-add-or-update',
    component: _import('modules/trans-resources/business-license/business-add-or-update'),
    name: 'business-add-or-update',
    meta: { title: '新增编辑' }
  },
  { path: '/trans-certificate/certificate-add-or-update',
    component: _import('modules/trans-resources/trans-certificate/certificate-add-or-update'),
    name: 'certificate-add-or-update',
    meta: { title: '新增编辑' }
  },
  { path: '/trans-products/products-add-or-update',
    component: _import('modules/trans-resources/trans-products/products-add-or-update'),
    name: 'products-add-or-update',
    meta: { title: '新增编辑' }
  },
  { path: '/warehouse/warehouse-add-or-update',
    component: _import('modules/trans-resources/warehouse/warehouse-add-or-update'),
    name: 'warehouse-add-or-update',
    meta: { title: '新增编辑' }
  },
  { path: '/perform-management-perform-appraisal/exam-template/template-add',
    component: _import('modules/perform-management/perform-appraisal/exam-template/template-add'),
    name: 'template-add',
    meta: { title: '新增模板' }
  },
  { path: '/perform-management-perform-appraisal/exam-template/template-view',
    component: _import('modules/perform-management/perform-appraisal/exam-template/template-view'),
    name: 'template-view',
    meta: { title: '模板预览' }
  },
  { path: '/perform-management/examinationRecord/template-view',
    component: _import('modules/perform-management/examinationRecord/template-view'),
    name: 'examination-template-view',
    meta: { title: '模板预览' }
  },
  { path: '/perform-management/shuttle-bus/template-view',
    component: _import('modules/perform-management/shuttle-bus/template-view'),
    name: 'shuttle-bus-template-view',
    meta: { title: '模板预览' }
  },
  { path: '/trans-resources/delegate-record/for-record',
    component: _import('modules/trans-resources/delegate-record/for-record'),
    name: 'for-record',
    meta: { title: '新增备案' }
  },
  { path: '/trans-resources/delegate-record/record-list',
    component: _import('modules/trans-resources/delegate-record/record-list'),
    name: 'record-list',
    meta: { title: '备案列表' }
  },
  { path: '/trans-resources/product/product-list',
    component: _import('modules/trans-resources/product/product-list'),
    name: 'product-list',
    meta: { title: '产品列表' } },
  { path: '/carrier-line/line-add-or-update',
    component: _import('modules/trans-resources/carrier-line/line-add-or-update'),
    name: 'line-add-or-update',
    meta: { title: '新增编辑' }
  },
  { path: '/cost-settlement/cargo-damage/shipper-details',
    component: _import('modules/cost-settlement/cargo-damage/shipper-details'),
    name: 'shipper-details',
    meta: { title: '委托方明细' }
  },
  { path: '/trans-resources/product/product-list',
    component: _import('modules/trans-resources/product/product-list'),
    name: 'product-list',
    meta: { title: '产品列表' }
  },
  { path: '/cost-settlement-cost/cost/cost-detail',
    component: _import('modules/cost-settlement/cost/cost-detail'),
    name: 'cost-detail',
    meta: { title: '对账明细' }
  },
  { path: '/cost-settlement-cost/invoice/invoice-add-or-update',
    component: _import('modules/cost-settlement/invoice/invoice-add-or-update'),
    name: 'invoice-add',
    meta: { title: '开票新增' }
  },
  { path: '/cost-settlement-cost/invoice/invoice-choice',
    component: _import('modules/cost-settlement/invoice/invoice-choice'),
    name: 'invoice-add',
    meta: { title: '开票新增' }
  },
  { path: '/cost-settlement-cost/invoice/invoice-detail',
    component: _import('modules/cost-settlement/invoice/invoice-detail'),
    name: 'invoice-detail',
    meta: { title: '开票详情' }
  },
  { path: '/cost-settlement-cost/invoice/invoice-examine',
    component: _import('modules/cost-settlement/invoice/invoice-examine'),
    name: 'invoice-examine',
    meta: { title: '开票审核' }
  },
  { path: '/cost-settlement-cost/invoice/invoice-off',
    component: _import('modules/cost-settlement/invoice/invoice-off'),
    name: 'invoice-off',
    meta: { title: '付款核销' } },
  { path: '/cost-settlement-cost/cargo-damage/detail',
    component: _import('modules/detailList/cargo-damage-details'),
    name: 'cargo-damage-details',
    meta: { title: '货损单明细' }
  },
  { path: '/customer-consolidation-details',
    component: _import('modules/trans-resources/custom-manage/customer-consolidation-details'),
    name: 'customer-consolidation-details',
    meta: { title: '详情' }
  },
  { path: '/customer-details',
    component: _import('modules/trans-resources/custom-manage/customer-details'),
    name: 'customer-details',
    meta: { title: '详情' }
  },
  { path: '/perform-management/examinationRecord/template-detail',
    component: _import('modules/perform-management/examinationRecord/template-detail'),
    name: 'template-details',
    meta: { title: '详情' }
  },
  { path: '/perform-management/shuttle-bus/template-detail',
    component: _import('modules/perform-management/shuttle-bus/template-detail'),
    name: 'shuttle-template-details',
    meta: { title: '详情' }
  },
  { path: '/dashboard-achievements/achievements/performance-information',
    component: _import('modules/dashboard/achievements/performance-information'),
    name: 'achievements-performance-information',
    meta: { title: '绩效信息' }
  },
  { path: '/dashboard-achievements/achievements/template-view',
    component: _import('modules/dashboard/achievements/template-view'),
    name: 'achievements-template-view',
    meta: { title: '模板预览' }
  },
  { path: '/dashboard-efficiency/efficiency/fine-detail',
    component: _import('modules/dashboard/efficiency/carrierFine/fine-detail'),
    name: 'efficiency-fine-detail',
    meta: { title: '看板扣罚明细' }
  },
  { path: '/dashboard-efficiency/efficiency/freight-detail',
    component: _import('modules/dashboard/efficiency/carrierFreight/freight-detail'),
    name: 'efficiency-freight-detail',
    meta: { title: '看板运费明细' }
  },
  { path: '/dashboard-efficiency/efficiency/damage-detail',
    component: _import('modules/dashboard/efficiency/carrierDamage/damage-detail'),
    name: 'efficiency-damage-detail',
    meta: { title: '看板货损明细' }
  },
  { path: '/dashboard-efficiency/efficiency/performance-information',
    component: _import('modules/dashboard/efficiency/performance-information'),
    name: 'efficiency-performance-information',
    meta: { title: '看板效率绩效信息' }
  },
  { path: '/dashboard-efficiency/efficiency/loadingRateDetails',
    component: _import('modules/dashboard/efficiency/loadingRateDetails/loadingRateDetails'),
    name: 'efficiency-loadingRateDetails',
    meta: { title: '看板效率装载率详情' }
  },
  { path: '/dashboard-efficiency/efficiency/vehicleDepartureDetail',
    component: _import('modules/dashboard/efficiency/vehicleDeparture/vehicleDepartureDetail'),
    name: 'efficiency-vehicleDepartureDetail',
    meta: { title: '看板效率绩效信息' }
  },
  { path: '/project-kpi/project-add-or-update',
    component: _import('modules/perform-management/project-kpi/project-add-or-update'),
    name: 'project-add-or-update',
    meta: { title: '新增编辑' }
  },
  { path: '/perform-management/kpi-page/kpi-details',
    component: _import('modules/perform-management/kpi-page/kpi-details'),
    name: 'kpi-details',
    meta: { title: '项目kpi详情' }
  },
  { path: '/trans-resources-car-validation/import-record-list',
    component: _import('modules/trans-resources/car-validation/import-record-list'),
    name: 'import-record-list',
    meta: { title: '导入记录' }
  }
]

export default routes
