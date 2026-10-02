const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordPattern = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

export function authSchema(body) {
  const { email, password } = body || {};

  if (!emailPattern.test(String(email || '').trim())) {
    return {
      error: 'Enter a valid email address.',
    };
  }

  if (!passwordPattern.test(String(password || ''))) {
    return {
      error:
        'Password must be 8-16 characters with one uppercase letter and one special character.',
    };
  }

  return {
    value: {
      email: String(email).trim().toLowerCase(),
      password: String(password),
    },
  };
}

export function signupSchema(body) {
  const { name, email, address, password } = body || {};

  const cleanName = String(name || '').trim();

  if (cleanName.length < 20 || cleanName.length > 60) {
    return {
      error: 'Name should be between 20 and 60 characters.',
    };
  }

  if (!emailPattern.test(String(email || '').trim())) {
    return {
      error: 'Enter a valid email address.',
    };
  }

  const cleanAddress = String(address || '').trim();

  if (cleanAddress.length > 400) {
    return {
      error: 'Address cannot exceed 400 characters.',
    };
  }

  if (!passwordPattern.test(String(password || ''))) {
    return {
      error:
        'Password must be 8-16 characters with one uppercase letter and one special character.',
    };
  }

  return {
    value: {
      name: cleanName,
      email: String(email).trim().toLowerCase(),
      address: cleanAddress,
      password: String(password),
    },
  };
}

export function changePasswordSchema(body) {
  const { currentPassword, newPassword } = body || {};

  if (!passwordPattern.test(String(newPassword || ''))) {
    return {
      error:
        'New password must be 8-16 characters with one uppercase letter and one special character.',
    };
  }

  if (!currentPassword) {
    return {
      error: 'Current password is required.',
    };
  }

  return {
    value: {
      currentPassword,
      newPassword,
    },
  };
}

export const loginSchema = authSchema;
export const passwordSchema = changePasswordSchema;
