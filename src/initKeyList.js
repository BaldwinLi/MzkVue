import Vue from 'vue';
export let commodityTypeList = [];
export let allianceBusiTypeList = [{
    "classId": 1,
    "className": "公共交通",
    "ifShow": 0
  },
  {
    "classId": 2,
    "className": "出租车",
    "ifShow": 0
  },
  {
    "classId": 3,
    "className": "购物",
    "ifShow": 0
  },
  {
    "classId": 4,
    "className": "电影院",
    "ifShow": 0
  },
  {
    "classId": 5,
    "className": "蛋糕店",
    "ifShow": 0
  },
  {
    "classId": 6,
    "className": "药房",
    "ifShow": 0
  },
  {
    "classId": 7,
    "className": "加油站",
    "ifShow": 0
  }
];
export let branchTypeList = [];
export const autoSortList = [{
    name: '智能排序',
    value: 1
  },
  {
    name: '距离最近',
    value: 2
  },
  {
    name: '评价最高',
    value: 3
  },
  {
    name: '优惠类型',
    value: 4
  }
];
export let recommodKeywordList = [{
    name: '搜索推荐',
    keywords: ['好利来', '大商影城', '华晨影业', '快客', '阳光大药房', '艾伦蛋糕']
  },
  {
    name: '最近搜索',
    keywords: ['好利来', '艾伦蛋糕']
  }
]

export const initKeyList = (appContextPath) => {
  Vue.http.get(`${appContextPath}appweb/pointExchange/listType`).then(success => {
    commodityTypeList = (success &&
      success.data &&
      success.data.result &&
      success.data.result.list) || [];
  });
  Vue.http.get(`${appContextPath}appweb/allianceBusi/listType`).then(success => {
    allianceBusiTypeList = (success &&
      success.data &&
      success.data.result &&
      success.data.result.list) || [];
  });
  Vue.http.get(`${appContextPath}appweb/branch/listType`).then(success => {
    branchTypeList = (success &&
      success.data &&
      success.data.result &&
      success.data.result.list) || [];
  });
};
