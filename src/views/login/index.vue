<template>
  <div class="login-container">
    <van-nav-bar
      class= "app-nav-bar"
      title= "注册 / 登录"
      left-arrow
      @click-left= "$router.back()"
    />
    <van-form
      :show-error= "false"
      :show-error-message= "false"
      ref= "login-form"
      @submit= "onLogin"
      @failed= "onFailed"
    >
      <van-field
        v-model= "user.mobile"
        icon-prefix= "toutiao"
        left-icon= "shouji"
        placeholder= "请输入手机号"
        name= "mobile"
        :rules= "formRules.mobile"
      />
      <van-field
        v-model= "user.code"
        clearable
        icon-prefix= "toutiao"
        left-icon= "yanzhengma"
        placeholder= "请输入验证码"
        name= "code"
        :rules= "formRules.code"
      >
        <template #button>
          <van-count-down
            v-if= "isCountDownShow"
            :time= "1000 * 60"
            format= "ss s"
            @finish= "isCountDownShow = false"
          />
          <van-button
            v-else
            class= "send-btn"
            size= "mini"
            round
            :loading = "isSendSmsLoading"
            @click.prevent= "onSendSms"
          >发送验证码</van-button>
        </template>
      </van-field>
      <div class= "login-btn-wrap">
        <van-button class= "login-btn" type= "info" block>登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '17090086870',
        code: '246810'
      },
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isCountDownShow: false,
      isSendSmsLoading: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLogin () {
      this.$toast.loading({
        mask: true,
        message: '登录中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const { data } = await login(this.user)
        this.$toast.success('登陆成功')

        // 将后端返回的用户登录状态（token等数据）放到 Vuex 容器中
        this.$store.commit('setUser', data.data)
      } catch (err) {
        this.$toast.fail('登录失败，手机号或验证码错误')
      }
    },
    onFailed (error) {
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message,
          position: 'top'
        })
      }
    },
    async onSendSms () {
      try {
        await this.$refs['login-form'].validate('mobile')
        // 展示按钮的 loading 状态， 防止网络慢的用户多次点击触发发送行为
        this.isSendSmsLoading = true
        // 验证通过，请求发送验证码
        await sendSms(this.user.mobile)
        // 信息发送出去了，隐藏发送按钮，显示倒计时
        this.isCountDownShow = true
      } catch (err) {
        // yrt 里面任何代码的错误都会进入 catch
        // 不同的错误需要有不同的提示，那就需要判断了
        let message = ''
        if (err && err.response && err.response.status === 429) {
          // 发送短信失败的错误提示
          message = '发送太频繁了，请稍后重试'
        } else if (err.name === 'mobile') {
          // 表单验证失败的错误提示
          message = err.message
        } else {
          // 未知错误提示
          message = '发送失败，请稍后重试'
        }
        this.$toast({
          message,
          position: 'top'
        })
      }
      // 无论发送验证码成功或失败，最后都要关闭发送按钮的 loading 状态
      this.isSendSmsLoading = false

      // 发送失败，显示发送按钮。关闭倒计时
      this.isCountDownShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  .send-btn {
    width: 76px;
    height: 23px;
    background-color: #ededed;
    .van-button__text {
      font-size: 11px;
      color: #666666;
    }
  }
  .login-btn-wrap {
    padding: 26px 16px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
      .van-button__text {
        font-size: 15px;
      }
    }
  }
}
</style>
