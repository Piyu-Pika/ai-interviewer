"use server"

// Types
type LoginData = {
  email: string
  password: string
}

type SignupData = {
  name: string
  email: string
  password: string
  role: string
}

type ResetPasswordData = {
  token: string
  password: string
}

// In a real application, these would interact with a database
// For this demo, we'll simulate authentication

// Login user
export async function loginUser(data: LoginData) {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Demo credentials for testing
    if (data.email === "admin@example.com" && data.password === "password") {
      return {
        success: true,
        token: "demo-token-admin-123",
        role: "admin",
        name: "Admin User",
      }
    } else if (data.email === "recruiter@example.com" && data.password === "password") {
      return {
        success: true,
        token: "demo-token-recruiter-123",
        role: "recruiter",
        name: "Recruiter User",
      }
    } else if (data.email === "user@example.com" && data.password === "password") {
      return {
        success: true,
        token: "demo-token-user-123",
        role: "candidate",
        name: "Candidate User",
      }
    }

    // Failed login
    return {
      success: false,
      error: "Invalid email or password",
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

// Signup user
export async function signupUser(data: SignupData) {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, you would save the user to a database
    // For demo purposes, we'll just return success

    return {
      success: true,
    }
  } catch (error) {
    console.error("Signup error:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

// Request password reset
export async function resetPassword(email: string) {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would send an email with a reset link
    // For demo purposes, we'll just return success

    return {
      success: true,
    }
  } catch (error) {
    console.error("Password reset request error:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

// Confirm password reset
export async function confirmPasswordReset(data: ResetPasswordData) {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would verify the token and update the password
    // For demo purposes, we'll just return success

    return {
      success: true,
    }
  } catch (error) {
    console.error("Password reset confirmation error:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

// Logout user (client-side only in this implementation)

