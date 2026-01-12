import {
  REGEX_PATTERNS,
  VALIDATION_MESSAGES
} from './constants'

export const validateEmail = (email) => {
  return REGEX_PATTERNS.EMAIL.test(email)
}

export const validatePassword = (password) => {
  return REGEX_PATTERNS.PASSWORD.test(password)
}

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== ''
}

export const getValidationError = (field, value, options = {}) => {
  if (!validateRequired(value)) {
    return VALIDATION_MESSAGES.REQUIRED
  }

  switch (field) {
    case 'email':
      return validateEmail(value) ? '' : VALIDATION_MESSAGES.EMAIL_INVALID
    case 'password':
      return validatePassword(value) ? '' : VALIDATION_MESSAGES.PASSWORD_WEAK
    default:
      return ''
  }
}

// API error handling utilities
export const formatApiError = (error) => {
  if (error.response?.data?.error) {
    return error.response.data.error
  }
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.message) {
    return error.message
  }
  return 'An unexpected error occurred'
}

export const isNetworkError = (error) => {
  return !error.response && error.request
}

// Array utilities
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key]
    if (!result[group]) {
      result[group] = []
    }
    result[group].push(item)
    return result
  }, {})
}

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (direction === 'desc') {
      return bVal > aVal ? 1 : -1
    }
    return aVal > bVal ? 1 : -1
  })
}

export const filterBy = (array, filters) => {
  return array.filter(item => {
    return Object.keys(filters).every(key => {
      const filterValue = filters[key]
      if (!filterValue) return true
      
      const itemValue = item[key]
      if (typeof filterValue === 'string') {
        return itemValue.toString().toLowerCase().includes(filterValue.toLowerCase())
      }
      return itemValue === filterValue
    })
  })
}

// String utilities
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const capitalizeWords = (str) => {
  if (!str) return ''
  return str.split(' ').map(capitalize).join(' ')
}

export const truncate = (str, length = 50) => {
  if (!str || str.length <= length) return str
  return str.substring(0, length) + '...'
}

// Local storage Data get
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return defaultValue
  }
}

// set localstorage set data 
export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error('Error writing to localStorage:', error)
    return false
  }
}

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('Error removing from localStorage:', error)
    return false
  }
}

// URL utilities
export const buildQueryString = (params) => {
  const query = new URLSearchParams()
  
  Object.keys(params).forEach(key => {
    const value = params[key]
    if (value !== null && value !== undefined && value !== '') {
      query.append(key, value)
    }
  })
  
  return query.toString()
}

export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString)
  const result = {}
  
  for (const [key, value] of params) {
    result[key] = value
  }
  
  return result
}

// Debounce Function as mentioned in the task to search functionality
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
} 