import { apiFetch , initCsrfToken} from "../shared/api.js"

const form = document.querySelector('#login-form')
const emailInput = document.querySelector('#email-input')
const passwordInput = document.querySelector('#password-input')
const errorMessage = document.querySelector('#error-message')

await initCsrfToken();

form.addEventListener('submit', async(e) => {
  e.preventDefault()

  clearErrors()

  const errors = getLoginFormErrors(emailInput.value, passwordInput.value)

  if(errors.length > 0) {
    errorMessage.innerText = errors.join(". ")
    return
  }

  errorMessage.innerText = ''

  const {response, data} = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: emailInput.value,
      password: passwordInput.value
    })
  })

  if (!response.ok) {
    let message = data?.error || 'Login failed'

    if (data?.retryAfter) {
      message += ` — Try again in ${data.retryAfter} seconds`
    };

    errorMessage.innerText = message;
    return
  }

  window.location.href = '/notes'
})

function getLoginFormErrors(email, password) {
  let errors = []

  if(!email) {
    errors.push('Email is required')
    emailInput.parentElement.classList.add('incorrect')
  }
  if(!password) {
    errors.push('Password is required')
    passwordInput.parentElement.classList.add('incorrect')
  }
  return errors;
}

function clearErrors() {
  document.querySelectorAll('.incorrect').forEach((el) => {
    el.classList.remove('incorrect')
  })
}

const allInputs = form.querySelectorAll('input')

allInputs.forEach(input => {
  input.addEventListener('input', () => {
    if(input.parentElement.classList.contains('incorrect')) {
      input.parentElement.classList.remove('incorrect')
      errorMessage.innerText = ''
    }
  })
})