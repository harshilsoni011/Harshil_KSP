
// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
}

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
}

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_WEAK: 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  NAME_REQUIRED: 'Name is required',
  TITLE_REQUIRED: 'Title is required',
  BODY_REQUIRED: 'Body is required',
  PASSWORDS_NOT_MATCH: 'Passwords do not match',
}

// API Response Messages
export const API_MESSAGES = {
  SUCCESS: {
    CREATE: 'Created successfully!',
    UPDATE: 'Updated successfully!',
    DELETE: 'Deleted successfully!',
    LOGIN: 'Login successful!',
    REGISTER: 'Registration successful!',
    LOGOUT: 'Logged out successfully!',
    QUESTION_CREATED: 'Question posted successfully!',
    ANSWER_POSTED: 'Answer posted successfully!',
    COMMENT_POSTED: 'Comment posted successfully!',
    VOTE_SUBMITTED: 'Vote submitted successfully!',
    PASSWORD_CHANGE: 'Password changed successfully!',
    PASSWORD_RESET: 'Password reset successfully!'
  },
  ERROR: {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied. You don\'t have permission to perform this action.',
    NOT_FOUND: 'Resource not found.',
    SERVER_ERROR: 'Internal server error. Please try again later.',
    UNEXPECTED: 'An unexpected error occurred.',
    VALIDATION: 'Please check your input and try again.',
    LOGIN_FAILED: 'Invalid credentials. Please try again.',
    REGISTER_FAILED: 'Registration failed. Please try again.',
    QUESTION_FAILED: 'Failed to create question.',
    ANSWER_FAILED: 'Failed to post answer.',
    COMMENT_FAILED: 'Failed to post comment.',
    VOTE_FAILED: 'Failed to submit vote.'
  },
  INFO: {
    LOGOUT: 'Logged out successfully'
  }
}