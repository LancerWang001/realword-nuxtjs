<template>
  <div>
    <form class="card comment-form">
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
					v-model="comment"
        />
      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <button :disabled="isAddingComment" @click.prevent="onAddComment" class="btn btn-sm btn-primary">Post Comment</button>
      </div>
    </form>

    <div
			class="card"
			v-for="comment of comments"
			:key="comment.id"
		>
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link :to="{
					name: 'profile',
					params: { username: comment.author.username }
				}" class="comment-author">
          <img
            :src="comment.author.image"
            class="comment-author-img"
          />
        </nuxt-link>
        &nbsp;
				<nuxt-link :to="{
					name: 'profile',
					params: { username: comment.author.username }
				}" class="comment-author">
          {{ comment.author.username }}
        </nuxt-link>
        <span class="date-posted">{{ comment.createdAt | date }}</span>
				<span v-if="isCurrentUser(comment.author.username)" class="mod-options" @click="onDelComment(comment.id)">
					<i class="ion-trash-a" ></i>
				</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, addComment, delComment } from '@/api/article'
import { mapState } from 'vuex'

export default {
	name: 'ArticleComments',
	computed: {
		...mapState(['user'])
	},
	props: {
		article: {
			type: Object,
			required: true
		}
	},
	data () {
		return {
			comments: [], // 文章列表
			comment: '', // 当前评论
			isDeletingComment: false,
			isAddingComment: false
		}
	},
	async mounted () {
		const { slug } = this.article
		const { data } = await getComments(slug)
		this.comments = data.comments
	},
	methods: {
		async onAddComment () {
			try {
				this.isAddingComment = true
				if (!this.comment) return;
				const { slug } = this.article
				const { data: { comment } } = await addComment(slug, this.comment)
				this.comments.push(comment)
				this.comment = ''
			} finally {
				this.isAddingComment = false
			}
		},
		async onDelComment (id) {
			if (this.isDeletingComment) return;
			try {
				this.isDeletingComment = true
				const { slug } = this.article
				await delComment(slug, id)
				const pos = this.comments.findIndex(
					({ id: delId }) => id === delId
				)
				this.comments.splice(pos, 1)
			} finally {
				this.isDeletingComment = false
			}
		},
		isCurrentUser (username) {
			return username === this.user.username
		}
	}
};
</script>

<style lang="scss" scoped>
</style>