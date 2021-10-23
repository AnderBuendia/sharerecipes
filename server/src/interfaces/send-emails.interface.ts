export interface SendEmails {
  email: string;
  mailContent: {
    url: string;
    text: string;
  };
}
