<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <van-button
        slot="title"
        class="search-btn"
        icon="search"
        type="info"
        round
        size="small"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 文章频道列表 -->
    <van-tabs v-model="active">
      <van-tab
        :title="item.name"
        v-for="item in channels"
        :key="item.id"
      >
        <!-- 文章列表 -->
        <article-list :channel="item" />
        <!-- /文章列表 -->
      </van-tab>
    </van-tabs>
    <!-- /文章频道列表 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList
  },
  props: {},
  data () {
    return {
      active: 0, // 控制被激活的标签
      channels: [] // 频道列表
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannels()
  },
  mounted () {},
  methods: {
    async loadChannels () {
      const { data } = await getUserChannels()
      this.channels = data.data.channels
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  /deep/ .van-nav-bar__title {
    max-width: none;
  }
  .search-btn {
    width: 277px;
    height: 32px;
    color: #5babfb;
    border: none;
    .van-cion {
      font-size: 16px;
      color: #fff;
    }
    .van-button__text {
      font-size: 14px;
      color: #fff;
    }
  }
}
</style>
