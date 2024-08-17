import * as yup from 'yup'

export const CommentSchema = yup.object(
    {
        comment: yup.string().required("Comment is Required")
    }
)