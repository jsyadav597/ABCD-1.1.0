import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Input, Button, Alert } from '../components'
import AuthLayout from '../layouts/AuthLayout'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const { login, error, clearError } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await login(formData.email, formData.password)

    if (result.success) {
      navigate('/dashboard')
    }

    setLoading(false)
  }

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your account">
      {error && (
        <Alert type="danger" title="Login Error">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="login-form">
        <Input
          type="email"
          name="email"
          label="Email Address"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading}
          className="login-button"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className="login-footer">
        <p>
          Don't have an account?{' '}
          <Link to="/register" className="register-link">
            Sign up here
          </Link>
        </p>
        <p>
          <Link to="/forgot-password" className="forgot-link">
            Forgot Password?
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Login
