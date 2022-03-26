<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{ active: tab === 'your_feed' }"
                  :to="{
                    name: 'home',
                    query: { tab: 'your_feed', limit, page },
                  }"
                >
                  Your Feed
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{ active: tab === 'global_feed' }"
                  :to="{
                    name: 'home',
                    query: { tab: 'global_feed', limit, page },
                  }"
                >
                  Global Feed
                </nuxt-link>
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{ active: tab === 'tag' }"
                  :to="{
                    name: 'home',
                    query: { tag, tab: 'tag' },
                  }"
                  ># {{ tag }}</nuxt-link
                >
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article of articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link :to="'/profile/' + article.author.username">
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  class="author"
                  :to="'/profile/' + article.author.username"
                >
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.createdAt | date }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{ active: article.favorited }"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link :to="'/article/' + article.slug" class="preview-link">
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">
              <li
                v-for="pagePos of totalPage"
                :key="pagePos"
                class="page-item"
                :class="{ active: page === pagePos }"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'home',
                    query: {
                      page: pagePos,
                      limit,
                      tag,
                      tab,
                    },
                  }"
                >
                  {{ pagePos }}
                </nuxt-link>
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                :to="{
                  name: 'home',
                  query: { tag, limit, page: 1, tab: 'tag' },
                }"
                class="tag-pill tag-default"
                v-for="tag of tags"
                :key="tag"
                >{{ tag }}</nuxt-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getArticles,
  getYourArticles,
  addFavorite,
  deleteFavorite,
} from "@/api/article";
import { getTags } from "@/api/tag";
import { mapState } from "vuex";

export default {
  name: "HomeIndex",
  watchQuery: ["page", "limit", "tag", "tab"],
  async asyncData({ query }) {
    const page = Number.parseInt(query.page) || 1;
    const limit = Number.parseInt(query.limit) || 20;
    const tag = query.tag;
    const tab = query.tab ?? "global_feed";
    const offset = (page - 1) * limit || 0;
    const articleService =
      tab === "your_feed"
        ? getYourArticles({
            limit: limit || undefined,
            offset,
          })
        : getArticles({
            limit: limit || undefined,
            offset,
            tag,
          });
    const [
      {
        data: { articles, articlesCount },
      },
      {
        data: { tags },
      },
    ] = await Promise.all([articleService, getTags()]);
    articles.forEach((article) => {
      article.favoriteDisabled = false;
    });
    return {
      articles,
      articlesCount,
      tags,
      limit,
      page,
      tag,
      tab,
    };
  },
  computed: {
    ...mapState(["user"]),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit) || 1;
    },
  },
  methods: {
    async onFavorite(article) {
      try {
        article.favoriteDisabled = true;
        if (article.favorited) {
          // 取消点赞
          const {
            data: { article: newArticle },
          } = await deleteFavorite(article.slug);
          Object.assign(article, newArticle);
        } else {
          // 添加点赞
          const {
            data: { article: newArticle },
          } = await addFavorite(article.slug);
          Object.assign(article, newArticle);
        }
      } finally {
        article.favoriteDisabled = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>