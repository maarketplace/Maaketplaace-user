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


export const formatNumber = (number: number | undefined): string => {
    if (number === undefined || number === null) {
        return '0'; // or handle this case as needed
    }
    return number.toLocaleString('en-US');
};

export const capitalizeFirstLetter = (str: string) => {
    if (!str) return ''; // Handle empty or undefined input
    return str.charAt(0).toUpperCase() + str.slice(1);
};