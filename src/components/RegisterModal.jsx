import { useState } from 'react'
import { Button, Input, Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react'
import { AUTH_BASE_URL, API_ENDPOINTS } from '../data/api'

function RegisterModal({ open, handleOpen }) {
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
          handleOpen()
        }, 2000)
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
    if (error) setError('')
  }

  const handleClose = () => {
    setFormData({ name: '', tg_username: '', phone_number: '' })
    setError('')
    setSuccess(false)
    handleOpen()
  }

  return (
    <Dialog open={open} handler={handleOpen} size="md" className="max-w-md">
      <DialogHeader className="text-2xl font-bold text-black">Регистрация для онлайн-записи</DialogHeader>
      <DialogBody>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm">
              ✅ Регистрация успешна! Теперь вы можете войти в систему.
            </div>
          )}

          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            label="Полное имя"
            required
            size="lg"
            disabled={isSubmitting}
          />
          
          <Input
            type="text"
            name="tg_username"
            value={formData.tg_username}
            onChange={handleInputChange}
            label="Имя пользователя Telegram"
            placeholder="@username"
            size="lg"
            disabled={isSubmitting}
          />
          
          <Input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            label="Номер телефона"
            placeholder="+998901234567"
            required
            size="lg"
            disabled={isSubmitting}
          />
          
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="w-full bg-barber-olive hover:bg-barber-gold text-white font-semibold"
            loading={isSubmitting}
          >
            {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </form>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={handleClose}
          className="mr-1"
        >
          Закрыть
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export default RegisterModal

