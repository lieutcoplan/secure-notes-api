import {apiFetch, initCsrfToken} from "../shared/api.js"

const form = document.querySelector('#register-form')
const nameInput = document.querySelector('#name-input')
const emailInput = document.querySelector('#email-input')
const passwordInput = document.querySelector('#password-input')
const repeatPasswordInput = document.querySelector('#repeat-password-input')
const errorMessage = document.querySelector('#error-message')

await initCsrfToken();

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  
  clearErrors()

  const errors = getRegisterFormErrors(emailInput.value, passwordInput.value, repeatPasswordInput.value);

  if(errors.length > 0) {
    errorMessage.innerText = errors.join(". ")
    return
  }

  errorMessage.innerText = '';

  const {response, data} = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value
    })
  });

  if (!response.ok) {
    errorMessage.innerText = data?.error || 'Register failed'
    return
  }

  window.location.href = '/login'
})

function getRegisterFormErrors(email, password, repeatPassword) {
  let errors = []

  if(!email) {
    errors.push('Email is required')
    emailInput.parentElement.classList.add('incorrect')
  }
  if(!password) {
    errors.push('Password is required')
    passwordInput.parentElement.classList.add('incorrect')
  }
  if(password.length < 8) {
    errors.push('Password must have at least 8 characters')
    passwordInput.parentElement.classList.add('incorrect')
  }
  if(password.length > 64) {
    errors.push('Password must have no more than 64 characters')
  passwordInput.parentElement.classList.add('incorrect')
  }
  if(password !== repeatPassword) {
    errors.push('Password does not match repeated password')
    passwordInput.parentElement.classList.add('incorrect')
    repeatPasswordInput.parentElement.classList.add('incorrect')
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