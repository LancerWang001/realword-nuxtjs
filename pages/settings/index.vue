<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  required
                  v-model="image"
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  required
                  v-model="username"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="bio"
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  required
                  v-model="email"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  required
                  v-model="password"
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                />
              </fieldset>
              <button
                type="submit"
                class="btn btn-lg btn-primary pull-xs-right"
                :disabled="isUpdating"
              >
                Update Settings
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { updateUser } from '@/api/user'

// 仅在客户端加载 cookie
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  name: "Settings",
  middleware: "authenticated",
  computed: {
    ...mapState(["user"])
  },
  data() {
    return {
      isUpdating: false,
      image: '',
      username: '',
      bio: '',
      email: '',
      password: '',
    };
  },
  mounted () {
    this.image = this.user.image
    this.username = this.user.username
    this.bio = this.user.bio
    this.email = this.user.email
    this.password = this.user.password
  },
  methods: {
    async onSubmit() {
      try {
        this.isUpdating = true;
        const { data } = await updateUser({
          image: this.image,
          username: this.username,
          bio: this.bio,
          email: this.email,
          password: this.password
        })
        const user = { ...this.user, ...data.user }
        this.$store.commit("setUser", user);
        // 为了防止页面刷新，数据丢失，需要持久化数据
        Cookie.set("user", JSON.stringify(user));
        // 跳转到首页
        this.$router.push({ name: 'profile', params: { username: this.username } });
      } finally {
        this.isUpdating = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>