<template>
  <v-dialog v-model="_value" max-width="500">
    <v-card class="MapAuthPopup__card">
      <v-card-title class="text-h5">Авторизация</v-card-title>

      <v-card-text class="MapAuthPopup__text">
        <v-text-field
          v-model="form.username"
          label="Логин"
          outlined
          dense
          required
        ></v-text-field>

        <v-text-field
          v-model="form.password"
          label="Пароль"
          type="password"
          outlined
          dense
          required
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="_value = false">Отмена</v-btn>
        <v-btn color="success" @click="onLogin">Войти</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'MapAuthPopup',
  props: { value: Boolean },

  data() {
    return {
      form: {
        username: '',
        password: '',
      },
    }
  },

  computed: {
    _value: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      },
    },
  },

  methods: {
    onLogin() {
      // Здесь можно реализовать логику авторизации
      const { username, password } = this.form;

      // Проверка логина и пароля
      if (username === 'admin' && password === 'admin') {
        // Вход выполнен успешно
        this._value = false; // Закрыть окно авторизации
        this.clearForm(); // Очистить форму
        // Вызвать событие успешной авторизации
        this.$emit('login', true);
      } else {
        // Вход не выполнен, можно показать сообщение об ошибке
        alert('Неправильный логин или пароль');
      }
    },

    clearForm() {
      this.form.username = '';
      this.form.password = '';
    },
  },
}
</script>


<style lang="sass">
</style>
