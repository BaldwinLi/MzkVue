import Vue from 'vue';
import store from './vuex/store';

const appContextPath = store.getters.appContextPath;

export const commodityTypeList = Vue.http.get(`${appContextPath}appweb/pointExchange/listType`).then(success => {
  return [{
    className: "全部类别",
    classId: ""
  }].concat((success &&
    success.data &&
    success.data.result &&
    success.data.result.list) || []);
});

export const allianceBusiTypeList = Vue.http.get(`${appContextPath}appweb/allianceBusi/listType`).then(success => {
  return [{
    className: "全部类别",
    classId: ""
  }].concat((success &&
    success.data &&
    success.data.result &&
    success.data.result.list) || []);
});

export const branchTypeList = Vue.http.get(`${appContextPath}appweb/branch/listType`).then(success => {
  return [{
    className: "全部类别",
    classId: ""
  }].concat((success &&
    success.data &&
    success.data.result &&
    success.data.result.list) || []);
});

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
export const recommodKeywordList = [{
    name: '搜索推荐',
    keywords: ['好利来', '大商影城', '华晨影业', '快客', '阳光大药房', '艾纶蛋糕']
  },
  {
    name: '最近搜索',
    keywords: ['好利来', '艾纶蛋糕']
  }
];
