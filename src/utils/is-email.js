// Copied from https://stackoverflow.com/a/9204568

const emailRegex = /\S+@\S+\.\S+/;

export default email => emailRegex.test(String(email).toLowerCase());
