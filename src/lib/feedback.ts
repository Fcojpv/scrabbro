import { z } from 'zod';

const googleFormUrl = z.string().url().refine((value) => {
  const url = new URL(value);
  return url.protocol === 'https:' && url.hostname === 'docs.google.com' &&
    /^\/forms\/d\/e\/[A-Za-z0-9_-]+\/viewform$/.test(url.pathname);
});

export const FEEDBACK_FORM_URL = googleFormUrl.parse(
  'https://docs.google.com/forms/d/e/1FAIpQLSfwybqTctFu5NjWecKMSt3Qq5mhd7czf5fJt32u3QokicmDbA/viewform?embedded=true',
);