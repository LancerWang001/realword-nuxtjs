<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="image" class="user-img" />
            <h4>{{ username }}</h4>
            <p>{{ bio }}</p>
            <button
              v-if="user.username !== username"
              class="btn btn-sm action-btn"
              :class="{
                'btn-secondary': following,
                'btn-outline-secondary': !following
              }"
            >
              <i class="ion-plus-round"></i>
              &nbsp; {{ following ? 'Unfollow' : 'Follow' }} {{ username }}
            </button>
            <nuxt-link
              v-else
              class="btn btn-sm btn-outline-secondary action-btn"
              to="/settings"
            >
              <i class="ion-gear-a"></i> Edit Profile Settings
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{ active: tab === 'my_article' }"
                  :to="{
                    name: 'profile',
                    params: { username },
                    query: { tab: 'my_article', limit, page },
                  }"
                >
                  My Articles
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{ active: tab === 'favorite_article' }"
                  :to="{
                    name: 'profile',
                    params: { username },
                    query: { tab: 'favorite_article', limit, page },
                  }"
                >
                  Favorited Articles
                </nuxt-link>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-for="article of articles" :key="article.slug">
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
              <ul class="tag-list">
                <li
                  v-for="tag of article.tagList"
                  :key="tag"
                  class="tag-default tag-pill tag-outline"
                >
                  {{ tag }}
                </li>
              </ul>
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
                    name: 'profile',
                    params: { username },
                    query: {
                      page: pagePos,
                      limit,
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
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getProfile } from '@/api/profile'
import {
  getArticles,
  addFavorite,
  deleteFavorite,
} from "@/api/article";

export default {
  name: "UserProfile",
  middleware: 'authenticated',
  watchQuery: ["page", "limit", "tab"],
  computed: {
    ...mapState(['user']),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit) || 1;
    },
  },
  async asyncData ({ params, query }) {
    const page = Number.parseInt(query.page) || 1;
    const limit = Number.parseInt(query.limit) || 5;
    const tab = query.tab || 'my_article';
    const { username } = params ?? {}
    const offset = (page - 1) * limit || 0;
    const profileSvc = getProfile(username)
    const articleSvc = getArticles({
      ...(tab === 'my_article' ? { author: username } : { favorited: username }),
      page: page || undefined,
      limit: limit || undefined,
      offset
    })
    const [{ data: { profile } }, { data: { articles, articlesCount } }] = await Promise.all([
      profileSvc, articleSvc
    ])
    articles.forEach((article) => {
      article.favoriteDisabled = false
    })
    return {
      articles,
      articlesCount,
      username: profile.username,
      bio: profile.bio,
      image: profile.image,
      following: profile.following,
      page,
      limit,
      tab
    }
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