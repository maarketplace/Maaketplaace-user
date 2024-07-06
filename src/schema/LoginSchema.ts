import * as yup from 'yup'

export const AdminLoginSchema = yup.object(
    {

        email: yup.string().email("Email must be a valid email format").required("Email is required"),
        password: yup
            .string()
            .required("Password is required")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/,
                "Password must be 8 characters long, uppercase and special character (!@#$%^&*)."
            ),
    }
)
    .required()

export const ForgotPasswordSchema = yup.object(
    {
        email: yup.string().email("Email must be a valid email format").required("Email is required"),
    }
)
    .required()

export const ResetPasswordSchema = yup.object(
    {
        password: yup
            .string()
            .required("Password is required")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/,
                "Password must be 8 characters long, uppercase and special character (!@#$%^&*)."
            ),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password')], 'Passwords must match')
            .required('Confirm Password is required'),
    }
)
    .required()