import * as yup from 'yup'


export const SignUpSchema = yup.object(
    {
        fullName: yup.string().required("Fullname is Required")
            .matches(
                /^[A-Za-z ]+$/,
                "Full name should not contain any special characters"
            ),
        // lastName: yup.string().required("Fullname is Required")
        //     .matches(
        //         /^[A-Za-z ]+$/,
        //         "Full name should not contain any special characters"
        //     ),
        email: yup.string().email("Email must be a valid email format").required("Email is required"),
        phoneNumber: yup
            .string()
            .required("Phone Number is required")
            .matches(/^0[789]\d{9}$/,
                "Please enter a valid phone number. Phone numbers can be in the following formats"
            ),
        // bio: yup.string().required('About you is required'),
        password: yup
            .string()
            .required("Password is required")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/,
                "Password must be 8 characters long, uppercase and special character (!@#$%^&*)."
            ),
        confirmPassword: yup.string()
            .oneOf([yup.ref('password')], 'Passwords must match')
            .required('Confirm Password is required'),
    }
)
    .required()