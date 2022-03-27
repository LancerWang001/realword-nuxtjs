<template>
  <div class="article-meta">
    <nuxt-link :to="{
			name: 'profile',
			params: {
				username: article.author.username
			}
		}">
			<img :src="article.author.image" />
		</nuxt-link>
    <div class="info">
      <nuxt-link class="author" :to="{
				name: 'profile',
				params: {
					username: article.author.username
				}
			}">
				{{ article.author.username }}
			</nuxt-link>
      <span class="date">{{ article.createdAt | date }}</span>
    </div>
		<!-- 订阅作者 -->
    <button
			v-if="!isCurrentUser"
			:class="{ active: article.author.following }"
			class="btn btn-sm btn-outline-secondary"
			@click="onClickFollow"
			:disabled="isFollowLoading"
		>
      <i class="ion-plus-round"></i>
      &nbsp; {{ article.author.following ? 'Unfollow' : 'Follow'}} {{ article.author.username }}
    </button>
    &nbsp;&nbsp;
		<!-- 订阅文章 -->
    <button
			v-if="!isCurrentUser"
			:class="{ active: article.favorited }"
			class="btn btn-sm btn-outline-primary"
			@click="onClickFavorite"
			:disabled="favoritedLoading"
		>
      <i class="ion-heart"></i>
      &nbsp; {{ article.favorited ? 'Unfavorite' : 'Favorite' }} Article <span class="counter">({{ article.favoritesCount }})</span>
    </button>
		<!-- 编辑文章 -->
		<nuxt-link
			v-if="isCurrentUser"
			:to="{
				name: 'editor',
				params: {
					slug: article.slug
				}
			}"
			class="btn btn-sm btn-outline-secondary"
		>
      <i class="ion-edit"></i>
      &nbsp; Edit Article
    </nuxt-link>
		<!-- 删除文章 -->
		<button
			v-if="isCurrentUser"
			class="btn btn-outline-danger btn-sm"
			:disabled="isDeleting"
			@click="deleteArticle"
		>
      <i class="ion-trash-a"></i> Delete Article
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { followUser, unFollowUser } from '@/api/user'
import { addFavorite, deleteFavorite, delArticle } from '@/api/article'

export default {
	name: 'ArticleMeta',
	computed: {
		...mapState(['user']),
		isCurrentUser () {
			return this.user.username === this.article.author.username
		}
	},
	props: {
		article: {
			type: Object,
			required: true
		}
	},
	data () {
		return {
			isFollowLoading: false,
			favoritedLoading: false,
			isDeleting: false
		}
	},
	head () {
		return {
			title: `${this.article.title} - RealWorld`,
			meta: [
				{
					hid: 'description',
					name: 'description',
					content: this.article.description
				}
			]
		}
	},
	methods: {
		// 订阅作者
		async onClickFollow () {
			try {
				this.isFollowLoading = true
				const { following, username } = this.article.author
				if (following) {
					await unFollowUser(username)
					this.article.author.following= false
				} else {
					await followUser(username)
					this.article.author.following= true
				}
			} finally {
				this.isFollowLoading = false
			}
		},
		// 订阅文章
		async onClickFavorite () {
			try {
				this.favoritedLoading = true
				const { slug, favorited } = this.article
				if (favorited) {
					await deleteFavorite(slug)
					this.article.favorited = false
					this.article.favoritesCount -= 1
				} else {
					await addFavorite(slug)
					this.article.favorited = true
					this.article.favoritesCount += 1
				}
			} finally {
				this.favoritedLoading = false
			}
		},
		// 删除文章
		async deleteArticle () {
			try {
				this.isDeleting = true
				await delArticle(this.article.slug)
				this.$router.push('/')
			} finally {
				this.isDeleting = false
			}
		}
	}
};
</script>

<style lang="scss" scoped>
</style>