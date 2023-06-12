<template>
  <v-dialog v-model="value_" max-width="400">
    <v-card>
      <v-card-title class="justify-center d-flex">
        Вход
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="onLogin">
          <v-text-field v-model="form.login" label="Логин" hide-details dense filled />
          <v-text-field v-model="form.password" label="Пароль" type="password" hide-details dense filled />
          <v-btn type="submit" style="position: absolute; width: 0; height: 0;" />
        </v-form>
      </v-card-text>
      <v-card-text class="justify-space-between d-flex">
        <v-btn @click="value_ = !value_">
          Закрыть
        </v-btn>
        <v-btn color="green" @click="onLogin">
          Войти
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      form: {
        login: '',
        password: '',
      }
    }
  },
  computed: {
    value_: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
  },
  methods: {
    onLogin() {
      console.log('login')
    }
  }
}
</script>