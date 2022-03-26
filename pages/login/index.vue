<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? "Sign in" : "Sign up" }}</h1>
          <p class="text-xs-center">
            <nuxt-link v-if="isLogin" to="/register"
              >Need an account?</nuxt-link
            >
            <nuxt-link v-else to="/login">Have an account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="(messgae, index) of messages" :key="index">
                {{ field }} {{ messgae }}
              </li>
            </template>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset v-if="!isLogin" class="form-group">
              <input
                class="form-control form-control-lg"
                required
                type="text"
                v-model="user.username"
                placeholder="Your Name"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="email"
                required
                v-model="user.email"
                placeholder="Email"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="password"
                required
                v-model="user.password"
                minlength="8"
                placeholder="Password"
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ isLogin ? "Sign in" : "Sign up" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from "@/api/user";

// 仅在客户端加载 cookie
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  name: "Login",
  middleware: "noAuthenticated",
  computed: {
    isLogin() {
      return this.$route.name === "login";
    },
  },
  data() {
    return {
      user: {
        username: "",
        email: "",
        password: "",
      },
      errors: {}, // 错误信息
    };
  },
  methods: {
    async onSubmit() {
      try {
        // 提交表单请求登陆
        const { data } = this.isLogin
          ? await login({ user: this.user })
          : await register({ user: this.user });
        // 保存用户的登录状态
        this.$store.commit("setUser", data.user);
        // 为了防止页面刷新，数据丢失，需要持久化数据
        Cookie.set("user", JSON.stringify(data.user));
        // 跳转到首页
        this.$router.push("/");
      } catch (err) {
        this.errors = err.response.data.errors;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>