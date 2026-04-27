
export async function getChatResponse(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });

    if (!response.ok) {
      throw new Error("Failed to communicate with AI");
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw new Error("Failed to connect to the medical intelligence engine.");
  }
}
