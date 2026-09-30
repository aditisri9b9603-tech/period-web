import { getGmailAccessToken } from '../firebase/config';

export interface GmailMessageHeader {
  id: string;
  threadId: string;
  snippet?: string;
  subject?: string;
  from?: string;
  date?: string;
}

// Convert string to base64url for RFC 2822 email payload
function encodeEmailPayload(to: string, from: string, subject: string, bodyText: string): string {
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const emailLines = [
    `To: ${to}`,
    `From: ${from}`,
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    bodyText,
  ];

  const emailRaw = emailLines.join('\r\n');
  return btoa(unescape(encodeURIComponent(emailRaw)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Send an email via the Gmail REST API
 */
export async function sendGmailEmail(params: {
  to: string;
  subject: string;
  body: string;
  userEmail: string;
}): Promise<{ success: boolean; id?: string }> {
  const token = getGmailAccessToken();
  if (!token) {
    throw new Error('Please sign in with Google to enable Gmail sending.');
  }

  const raw = encodeEmailPayload(params.to, params.userEmail, params.subject, params.body);

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Gmail API error (${res.status})`);
  }

  const data = await res.json();
  return { success: true, id: data.id };
}

/**
 * List recent messages (e.g., medical or wellness related)
 */
export async function listRecentGmailMessages(query = ''): Promise<GmailMessageHeader[]> {
  const token = getGmailAccessToken();
  if (!token) {
    throw new Error('Please sign in with Google to access Gmail messages.');
  }

  const url = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
  url.searchParams.set('maxResults', '8');
  if (query) {
    url.searchParams.set('q', query);
  }

  const listRes = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!listRes.ok) {
    const errorData = await listRes.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Failed to fetch messages (${listRes.status})`);
  }

  const listData = await listRes.json();
  const messages = listData.messages || [];

  // Fetch snippets & headers for the messages
  const detailedMessages: GmailMessageHeader[] = [];

  for (const m of messages.slice(0, 5)) {
    try {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        const headers = msgData.payload?.headers || [];
        const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
        const from = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || 'Unknown';
        const date = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';

        detailedMessages.push({
          id: m.id,
          threadId: m.threadId,
          snippet: msgData.snippet,
          subject,
          from,
          date,
        });
      }
    } catch {
      // ignore individual failures
    }
  }

  return detailedMessages;
}
