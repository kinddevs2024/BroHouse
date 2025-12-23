import { useState } from 'react'
import { Button, Input } from '@material-tailwind/react'
import { AUTH_BASE_URL, API_ENDPOINTS } from '../data/api'

function RegisterForm() {
  const [formData, setFormData] = useState({ 
    name: '', 
    tg_username: '', 
    phone_number: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess(false)

    try {
      // Public client registration uses POST /client
      const response = await fetch(`${AUTH_BASE_URL}${API_ENDPOINTS.createClient}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        body: JSON.stringify({
          name: formData.name,
          phone_number: formData.phone_number,
          ...(formData.tg_username && {
            tg_username: formData.tg_username.replace(/^@/, ''),
          }),
        })
      })

      const data = await response.json()

      // Handle different error status codes
      if (response.status === 400) {
        setError(data.message || data.error || 'Регистрация не удалась. Проверьте введенные данные.')
      } else if (response.status === 401) {
        setError('Ошибка авторизации. Пожалуйста, попробуйте еще раз.')
      } else if (response.status === 403) {
        setError('Доступ запрещен. Пожалуйста, свяжитесь с администратором.')
      } else if (response.status === 409) {
        setError(data.message || data.error || 'Пользователь с такими данными уже существует.')
      } else if (response.ok || response.status === 201) {
        setSuccess(true)
        setFormData({ name: '', tg_username: '', phone_number: '' })
        setTimeout(() => {
          setSuccess(false)
        }, 5000)
      } else {
        setError(data.message || data.error || 'Регистрация не удалась. Пожалуйста, попробуйте еще раз.')
      }
    } catch (error) {
      setError('Ошибка сети. Пожалуйста, проверьте подключение и попробуйте еще раз.')
      console.error('Registration error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (error) setError('')
  }

  return (
    <form className="space-y-3 sm:space-y-4 md:space-y-6" onSubmit={handleFormSubmit}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm">
          ✅ Регистрация успешна! Теперь вы можете войти.
        </div>
      )}

      <Input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Введите ваше имя"
        required
        size="lg"
        className="!text-black !bg-white"
        labelProps={{
          className: "hidden"
        }}
        disabled={isSubmitting}
        aria-label="Your name"
      />
      
      <Input
        type="text"
        name="tg_username"
        value={formData.tg_username}
        onChange={handleInputChange}
        placeholder="Введите имя пользователя Telegram (например, @username)"
        size="lg"
        className="!text-black !bg-white"
        labelProps={{
          className: "hidden"
        }}
        disabled={isSubmitting}
        aria-label="Telegram username"
      />
      
      <Input
        type="tel"
        name="phone_number"
        value={formData.phone_number}
        onChange={handleInputChange}
        placeholder="Введите номер телефона (например, +998901234567)"
        required
        size="lg"
        className="!text-black !bg-white"
        labelProps={{
          className: "hidden"
        }}
        disabled={isSubmitting}
        aria-label="Phone number"
      />
      
      <Button
        type="submit"
        disabled={isSubmitting}
        size="lg"
        className="w-full bg-barber-olive hover:bg-barber-gold text-white font-semibold rounded-xl sm:rounded-2xl text-sm sm:text-base py-3 sm:py-3.5 md:py-4"
        loading={isSubmitting}
      >
        {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
      </Button>
      
      <p className="text-white text-xs sm:text-sm opacity-70 text-center">
        Создайте аккаунт для онлайн-записи
      </p>
    </form>
  )
}

export default RegisterForm

