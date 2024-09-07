import * as Yup from 'yup';

export const UploadQuicksSchema = Yup.object().shape({
    image: Yup
        .mixed()
        .test('fileType', 'Unsupported File Format', value => {
            if (!value) return true; // If no file is provided, validation passes
            if (value instanceof File) { // Check if value is a File object
                return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
            }
            return false; // If value is not a File, fail the validation
        }),
    video: Yup
        .mixed()
        .test('fileType', 'Unsupported File Format', value => {
            if (!value) return true; // If no file is provided, validation passes
            if (value instanceof File) { // Check if value is a File object
                return ['video/mp4', 'video/avi', 'video/mov'].includes(value.type);
            }
            return false; // If value is not a File, fail the validation
        }),
    message: Yup.string().required('Message is required'),
});
