//index.js
import * as echarts from '../../components/ec-canvas/echarts'
import china from '../../components/ec-canvas/china.js'

const app = getApp()

Page({
  data: {
    // 时间
    times: '',
    // 确诊
    gntotal: 0,
    // 疑似
    sustotal: 0,
    // 死亡
    deathtotal: 0,
    // 治愈
    curetotal: 0,
    // 全国疫情地图
    totalMapChart: {
      lazyLoad: true
    },
    // 全国累计趋势图（确诊+疑似+死亡+治愈）
    totalLineChart: {
      lazyLoad: true
    },
    // 全国新增趋势图（确诊+疑似）
    addLineChart: {
      lazyLoad: true
    },
    // 武汉累计趋势图（确诊+死亡+治愈）
    wuhanLineChart: {
      lazyLoad: true
    },
    // 世界疫情地图
    worldMapChart: {
      lazyLoad: true
    },
  },

  onLoad: function() {
    this.totalMapComponent = this.selectComponent('#total-map')
    this.totalLineComponent = this.selectComponent('#total-line')
    this.addLineComponent = this.selectComponent('#add-line')
    this.wuhanLineComponent = this.selectComponent('#wuhan-line')
    this.worldMapComponent = this.selectComponent('#world-map')
    wx.request({
      url: 'https://interface.sina.cn/news/wap/fymap2020_data.d.json?callback=a',
      success: res => {
        const data = JSON.parse(res.data.slice(7, -2)).data
        console.log(data)
        this.setData({
          times: data.times,
          gntotal: data.gntotal,
          sustotal: data.sustotal,
          deathtotal: data.deathtotal,
          curetotal: data.curetotal
        })
        this._initTotalMapChart(data.list)
        this._initTotalLineChart(data.historylist)
        this._initAddLineChart(data.historylist)
        this._initWuhanLineChart(data.historylist)
        this._initWorldMapChart(data.worldlist)
      }
    })
  },

  _initWorldMapChart: function (data) {
    wx.request({
      url: 'https://n.sinaimg.cn/news/cece9e13/20200127/world.geo.json',
      success: res => {
        const geoJSON = res.data
        console.log(geoJSON)
        echarts.registerMap('world', geoJSON)
        this.worldMapComponent.init((canvas, width, height) => {
          const mapChart = echarts.init(canvas, null, {
            width: width,
            height: height
          })
          mapChart.setOption(this._getWorldMapOption(data));
        })
      }
    })
  },

  _initTotalMapChart: function (data) {
    this.totalMapComponent.init((canvas, width, height) => {
      const mapChart = echarts.init(canvas, null, {
        width: width,
        height: height
      })

      mapChart.setOption(this._getTotalMapOption(data));
    })
  },

  _initTotalLineChart: function (data) {
    this.totalLineComponent.init((canvas, width, height) => {
      const lineChart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      lineChart.setOption(this._getTotalLineOption(data));
    })
  },

  _initAddLineChart: function (data) {
    this.addLineComponent.init((canvas, width, height) => {
      const lineChart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      lineChart.setOption(this._getAddLineOption(data));
    })
  },

  _initWuhanLineChart: function (data) {
    this.wuhanLineComponent.init((canvas, width, height) => {
      const lineChart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      lineChart.setOption(this._getWuhanLineOption(data));
    })
  },

  _getTotalMapOption: function (data) {
    const _option = {
      visualMap: {
        left: 'left',
        itemWidth: 16,
        itemHeight: 10,
        textGap: 8,
        itemGap: 8,
        pieces: [
          { min: 0, max: 0, label: '0', color: 'rgb(242, 242, 242)' },
          { min: 1, max: 9, label: '1-9', color: 'rgb(250, 234, 201)'},
          { min: 10, max: 99, label: '10-99', color: 'rgb(237, 151, 122)' },
          { min: 100, max: 499, label: '100-499', color: 'rgb(216, 78, 66)' },
          { min: 500, max: 1000, label: '500-1000', color: 'rgb(187, 27, 37)' },
          { min: 1001, label: '>1000', color: 'rgb(98, 12, 21)'}
        ]
      },
      series: [{
        name: 'map',
        type: 'map',
        roam: true,
        map: 'china',
        label: {
          show: true,
          fontSize: 10
        },
        data: []
      }]
    }
    data.forEach(list => {
      _option.series[0].data.push({
        name: list.name,
        value: list.value
      })
    })
    return _option
  },

  _getWorldMapOption: function (data) {
    const _option = {
      visualMap: {
        left: 'left',
        itemWidth: 16,
        itemHeight: 10,
        textGap: 8,
        itemGap: 8,
        pieces: [
          { min: 0, max: 0, label: '0', color: 'rgb(242, 242, 242)' },
          { min: 1, max: 9, label: '1-9', color: 'rgb(250, 234, 201)' },
          { min: 10, max: 100, label: '10-100', color: 'rgb(216, 78, 66)' },
          { min: 101, label: '>100', color: 'rgb(98, 12, 21)' }
        ]
      },
      series: [{
        name: 'map',
        type: 'map',
        roam: true,
        map: 'world',
        label: {
          show: false,
          fontSize: 10
        },
        nameMap: {
          'China': '中国',
          'Germany': '德国',
          'Spain': '西班牙',
          'Russia': '俄罗斯',
          'Cambodia': '柬埔寨',
          'India': '印度',
          'United Arab Emirates': '阿联酋',
          'Sri Lanka': '斯里兰卡',
          'Thailand': '泰国',
          'South Korea': '韩国',
          'Japan': '日本',
          'Philippines': '菲律宾',
          'Malaysia': '马来西亚',
          'Vietnam': '越南',
          'United States of America': '美国',
          'Australia': '澳大利亚',
          'Mexico': '墨西哥',
          'Brazil': '巴西',
          'Colombia': '哥伦比亚',
          'United Kingdom': '英国',
          'Italy': '意大利',
          'Canada': '加拿大',
          'Finland': '芬兰',
          'Nepal': '尼泊尔',
          'France': '法国',
          'Ivory Coast': '科特迪瓦',
          'Switzerland': '瑞士',
          'Israel': '以色列',
          'Ecuador': '厄瓜多尔',
          'Sewden': '瑞典'
        },
        data: []
      }]
    }
    data.forEach(list => {
      _option.series[0].data.push({
        name: list.name,
        value: list.value
      })
    })
    return _option
  },

  _getTotalLineOption: function (data) {
    const _option = {
      legend: {
        top: '2%',
        textStyle: {
          color: 'black'
        }
      },
      xAxis: [{
        name: '日期',
        nameGap: 8,
        axisTick: {
          inside: true,
          alignWithLabel: true
        },
        axisLine: {
          lineStyle: { color: '#999' }
        },
        axisLabel: {
          color: '#333',
          fontSize: 10,
          rotate: 45
        },
        data: []
      },{
        name: '日期',
        nameGap: 8,
        axisTick: {
          inside: true,
          alignWithLabel: true
        },
        axisLine: {
          lineStyle: { color: '#999' }
        },
        axisLabel: {
          color: '#333',
          fontSize: 10,
          rotate: 45
        },
        data: [],
        gridIndex: 1
      }],
      yAxis: [{
        name: '人数',
        axisTick: { show: false },
        axisLine: {
          lineStyle: { color: '#999' }
        },
        axisLabel: {
          color: '#333',
          fontSize: 10
        },
      },{
        name: '人数',
        axisTick: { show: false },
        axisLine: {
          lineStyle: { color: '#999' }
        },
        axisLabel: {
          fontSize: 10,
          color: '#333'
        },
        gridIndex: 1
      }],
      grid: [{
        left: '12%',
        right: '10%',
        top: '10%',
        bottom: '55%'
      }, {
        top: '57%',
        right: '10%',
        bottom: '7%',
        left: '12%'
      }],
      series: [{
        type: 'line',
        name: '确诊',
        itemStyle: { color: 'rgb(247, 76, 49)' },
        showSymbol: true,
        data: []
      },{
        type: 'line',
        name: '疑似',
        itemStyle: { color: 'rgb(247, 130, 7)' },
        showSymbol: true,
        data: []
      },{
        type: 'line',
        name: '死亡',
        itemStyle: { color: 'rgb(93, 112, 146)' },
        showSymbol: true,
        data: []
      },{
        type: 'line',
        name: '治愈',
        itemStyle: { color: 'rgb(40, 183, 163)' },
        showSymbol: true,
        data: []
      },{
        type: 'line',
        name: '死亡',
          itemStyle: { color: 'rgb(93, 112, 146)' },
        showSymbol: true,
        data: [],
        xAxisIndex: 1,
        yAxisIndex: 1
      },{
        type: 'line',
        name: '治愈',
        itemStyle: { color: 'rgb(40, 183, 163)' },
        showSymbol: true,
        data: [],
        xAxisIndex: 1,
        yAxisIndex: 1
      }]
    }
    let len = data.length
    for (let i = len - 1; i >= 0; i--) {
      _option.xAxis[0].data.push(data[i].date)
      _option.xAxis[1].data.push(data[i].date)
      _option.series[0].data.push(data[i].cn_conNum)
      _option.series[1].data.push(data[i].cn_susNum)
      _option.series[2].data.push(data[i].cn_deathNum)
      _option.series[3].data.push(data[i].cn_cureNum)
      _option.series[4].data.push(data[i].cn_deathNum)
      _option.series[5].data.push(data[i].cn_cureNum)
    }
    return _option
  },

  _getAddLineOption: function (data) {
    const _option = {
      legend: {
        top: '4%',
        textStyle: {
          color: 'black'
        }
      },
      xAxis: {
        name: '日期',
        nameGap: 8,
        axisTick: {
          inside: true,
          alignWithLabel: true
        },
        axisLine: {
          lineStyle: { color: '#999' }
        },
        axisLabel: {
          color: '#333',
          fontSize: 10,
          rotate: 45
        },
        data: []
      },
      yAxis: {
        name: '人数',
        axisTick: { show: false },
        axisLine: {
          lineStyle: { color: '#999' }
        },
        axisLabel: {
          color: '#333',
          fontSize: 10
        },
      },
      grid: {
        left: '12%',
        right: '10%',
        top: '18%',
        bottom: '10%'
      },
      series: [{
        type: 'line',
        name: '确诊',
        itemStyle: { color: 'rgb(247, 76, 49)' },
        showSymbol: true,
        data: []
      }, {
        type: 'line',
        name: '疑似',
        itemStyle: { color: 'rgb(247, 130, 7)' },
        showSymbol: true,
        data: []
      }]
    }
    let len = data.length
    for (let i = len - 1; i > 0; i--) {
      _option.xAxis.data.push(data[i - 1].date)
      _option.series[0].data.push(data[i - 1].cn_conNum - data[i].cn_conNum)
      _option.series[1].data.push(data[i - 1].cn_susNum - data[i].cn_susNum)
    }
    return _option
  },

  _getWuhanLineOption: function (data) {
    const _option = {
      legend: {
        top: '4%',
        textStyle: {
          color: 'black'
        }
      },
      xAxis: {
        name: '日期',
        nameGap: 8,
        axisTick: {
          inside: true,
          alignWithLabel: true
        },
        axisLine: {
          lineStyle: { color: '#999' }
        },
        axisLabel: {
          color: '#333',
          fontSize: 10,
          rotate: 45
        },
        data: []
      },
      yAxis: {
        name: '人数',
        axisTick: { show: false },
        axisLine: {
          lineStyle: { color: '#999' }
        },
        axisLabel: {
          color: '#333',
          fontSize: 10
        },
      },
      grid: {
        left: '12%',
        right: '10%',
        top: '18%',
        bottom: '10%'
      },
      series: [{
        type: 'line',
        name: '确诊',
        itemStyle: { color: 'rgb(247, 76, 49)' },
        showSymbol: true,
        data: []
      },{
        type: 'line',
        name: '死亡',
        itemStyle: { color: 'rgb(93, 112, 146)' },
        showSymbol: true,
        data: []
      },{
        type: 'line',
        name: '治愈',
        itemStyle: { color: 'rgb(40, 183, 163)' },
        showSymbol: true,
        data: []
      }]
    }
    let len = data.length
    for (let i = len - 1; i >= 0; i--) {
      _option.xAxis.data.push(data[i].date)
      _option.series[0].data.push(data[i].wuhan_conNum)
      _option.series[1].data.push(data[i].wuhan_deathNum)
      _option.series[2].data.push(data[i].wuhan_cureNum)
    }
    return _option
  }
})
