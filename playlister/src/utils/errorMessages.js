
export const getAuthErrorMessage = (code) => {
  const errorMessages = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'Operation not allowed.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/invalid-otp': 'Invalid OTP. Please try again.',
    'auth/expired-otp': 'OTP has expired. Please request a new one.',
  };
  return errorMessages[code] || 'An error occurred. Please try again.';
};
