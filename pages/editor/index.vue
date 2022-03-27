<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent="publishArticle">
            <fieldset>
              <fieldset class="form-group">
                <input
                  required
                  v-model="title"
                  :disabled="isPublishing"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  required
                  v-model="description"
                  :disabled="isPublishing"
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  required
                  v-model="body"
                  :disabled="isPublishing"
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="tags"
                  :disabled="isPublishing"
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                />
                <div class="tag-list"></div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="submit"
                :disabled="isPublishing"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticle, publishArticle, updateArticle } from '@/api/article'

export default {
  name: "Editor",
  middleware: 'authenticated',
  computed: {
    tags: {
      get () {
        return this.tagList.join(' ')
      },
      set (tags = '') {
        this.tagList = tags ? tags.split(' ') : []
      }
    }
  },
  data () {
    return {
      title: '',
      description: '',
      body: '',
      tagList: [],
      isPublishing: false
    }
  },
  async asyncData ({ params }) {
    const { slug } = params || {}
    if (!slug) return {
      title: '',
      description: '',
      body: '',
      tagList: [],
    }
    const { data: { article } } = await getArticle(slug)
    return {
      title: article.title,
      description: article.description,
      body: article.body,
      tagList: article.tagList
    }
  },
  methods: {
    // 发布文章
    async publishArticle () {
      try {
        this.isPublishing = true
        const { params } = this.$route
        const serviceParams = {
          title: this.title,
          description: this.description,
          body: this.body,
        }
        const service = params.slug ?
          updateArticle(serviceParams, params.slug)
          : publishArticle({ ...serviceParams, tagList: this.tagList })

        const { data: { article: { slug } } } = await service
        this.$router.push({ name: 'article', params: { slug } })
      } finally {
        this.isPublishing = false
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>