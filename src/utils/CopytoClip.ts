import toast from "react-hot-toast";

export const copyToClipboard = (text: string) => {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
    toast.success('Link copied successfully!');
};