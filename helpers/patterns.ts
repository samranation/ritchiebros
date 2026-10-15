const PHONE = String.raw`\+?(?:[\s().-]*\d){10,15}[\s().-]*`;
export const PHONE_NUMBER = new RegExp(`^${PHONE}$`);
