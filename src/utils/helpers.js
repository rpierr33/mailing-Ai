export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function getInitials(firstName, lastName) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
}

export function getStatusColor(status) {
  const colors = {
    Sent: 'bg-emerald-50 text-emerald-700',
    Active: 'bg-emerald-50 text-emerald-700',
    Scheduled: 'bg-blue-50 text-blue-700',
    Draft: 'bg-gray-100 text-gray-600',
    Paused: 'bg-amber-50 text-amber-700',
    Cancelled: 'bg-red-50 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-600';
}

export function getTypeBadge(type) {
  const colors = {
    Regular: 'bg-gray-100 text-gray-600',
    'A/B Test': 'bg-purple-50 text-purple-700',
    Automated: 'bg-blue-50 text-blue-700',
    SMS: 'bg-teal-50 text-teal-700',
  };
  return colors[type] || 'bg-gray-100 text-gray-600';
}

export async function callClaude(prompt, apiKey) {
  if (!apiKey) {
    // Simulate AI response for demo mode
    return simulateAI(prompt);
  }
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!response.ok) throw new Error('API call failed');
  const data = await response.json();
  return data.content[0].text;
}

function simulateAI(prompt) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (prompt.includes('subject lines')) {
        resolve(JSON.stringify([
          "You won't want to miss this",
          "Something special just for you",
          "Your exclusive update is here",
          "Big news inside",
          "We've got exciting things to share"
        ]));
      } else if (prompt.includes('email body copy')) {
        resolve(JSON.stringify([
          "We're thrilled to share something new with you. Our team has been working hard to bring you the best experience possible. Check out what's new and let us know what you think.",
          "Great things are happening and we wanted you to be the first to know. Dive in and explore what we've been building just for you.",
          "Here's your quick update: we've made improvements you'll love. Take a look and see the difference for yourself."
        ]));
      } else if (prompt.includes('segments')) {
        resolve(JSON.stringify([
          { name: "High-Value Engaged", description: "Contacts with 5-star rating who opened emails in the last 30 days" },
          { name: "At-Risk Subscribers", description: "Contacts who haven't opened any email in 60+ days" },
          { name: "Recent Converters", description: "Contacts tagged as customers who subscribed in the last 90 days" }
        ]));
      } else {
        resolve(JSON.stringify(["AI-generated content will appear here when API key is configured."]));
      }
    }, 1200);
  });
}

export function parseAIResponse(text) {
  const cleaned = text.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
}
