<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="login-title">TeamSpirit 勤怠管理システム</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="employeeId" class="form-label">社員コード</label>
          <input
            id="employeeId"
            v-model="employeeId"
            type="text"
            class="form-input"
            placeholder="社員コードを入力"
            :class="{ error: fieldErrors.employeeId }"
          />
          <p class="field-error">
            {{ fieldErrors.employeeId || ' ' }}
          </p>
        </div>
        <div class="form-group">
          <label for="password" class="form-label">パスワード</label>
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="form-input"
            placeholder="パスワードを入力"
            :class="{ error: fieldErrors.password }"
          />
          <p class="field-error">
            {{ fieldErrors.password || ' ' }}
          </p>
          <label class="toggle-visibility">
            <input
              type="checkbox"
              v-model="showPassword"
            />
            <span>パスワードを表示</span>
          </label>
        </div>
        <div class="error-message-wrapper">
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </div>
        <button type="submit" class="login-button" :disabled="isLoading">
          {{ isLoading ? 'ログイン中...' : 'ログイン' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { login } from '@/services/api'

export default {
  name: 'LoginScreen',
  data() {
    return {
      employeeId: '',
      password: '',
      errorMessage: '',
      fieldErrors: {
        employeeId: '',
        password: ''
      },
      showPassword: false,
      isLoading: false
    }
  },
  methods: {
    validateInput() {
      this.fieldErrors.employeeId = ''
      this.fieldErrors.password = ''

      const trimmedEmployeeId = (this.employeeId || '').trim().toUpperCase()
      const trimmedPassword = (this.password || '').trim()
      this.employeeId = trimmedEmployeeId
      this.password = trimmedPassword

      let hasError = false
      if (!trimmedEmployeeId) {
        this.fieldErrors.employeeId = '社員コードは必須です。'
        hasError = true
      }

      if (!trimmedPassword) {
        this.fieldErrors.password = 'パスワードは必須です。'
        hasError = true
      }

      if (hasError) {
        return { isValid: false }
      }

      if (!/^\d{6}$/.test(trimmedEmployeeId)) {
        this.fieldErrors.employeeId = '社員コードの桁数は数字6桁で入力してください。'
        return { isValid: false }
      }

      return { isValid: true }
    },
    async handleLogin() {
      this.errorMessage = ''
      
      // 入力チェック
      const validationResult = this.validateInput()
      if (!validationResult.isValid) {
        return
      }

      this.isLoading = true

      try {
        const response = await login(this.employeeId, this.password)

        if (response.success) {
          // 認証成功：ログイン情報をlocalStorageに保存
          localStorage.setItem('employeeId', response.employeeId)
          localStorage.setItem('employeeName', response.employeeName)
          
          // ホーム画面へ遷移
          this.$router.push({
            name: 'Home',
            query: {
              employeeId: response.employeeId,
              employeeName: response.employeeName
            }
          })
        } else {
          this.errorMessage = response.message || '社員コードまたはパスワードが違います。'
        }
      } catch (error) {
        console.error('Login error:', error)
        this.handleErrorResponse(error)
      } finally {
        this.isLoading = false
      }
    },
    handleErrorResponse(error) {
      if (error.status === 401) {
        this.errorMessage = '社員コードまたはパスワードが違います。'
      } else if (error.status === 500) {
        this.errorMessage = 'サーバーエラーが発生しました。データベース接続を確認してください。'
      } else if (error.message) {
        this.errorMessage = error.message
      } else {
        this.errorMessage = 'サーバーに接続できません。バックエンドサーバーが起動しているか確認してください。'
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #B0C4DF;
  padding: 20px;
}

.login-box {
  background-color: white;
  border: 1px solid #000;
  border-radius: 8px;
  padding: 40px;
  width: auto;
  max-width: 500px;
  min-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: bold;
  color: #000;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 16px;
  font-weight: bold;
  color: #000;
}

.form-input {
  width: 100%;
  height: 65px;
  padding: 0 15px;
  border: 1px solid #000;
  border-radius: 4px;
  font-size: 16px;
  background-color: #fff;
}

.form-input:focus {
  outline: none;
  border-color: #4A90E2;
}

.form-input.error {
  border-color: #FF0D0D;
}

.field-error {
  min-height: 18px;
  font-size: 12px;
  color: #FF0D0D;
  margin: -4px 0 4px;
}

.toggle-visibility {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #333;
}

.toggle-visibility input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.error-message-wrapper {
  min-height: 48px;
}

.error-message {
  background-color: #FFE5E5;
  color: #FF0D0D;
  padding: 12px;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
}

.login-button {
  width: 100%;
  height: 65px;
  background-color: #FF0D0D;
  color: white;
  border: 1px solid #000;
  border-radius: 4px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover:not(:disabled) {
  background-color: #E00C0C;
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

