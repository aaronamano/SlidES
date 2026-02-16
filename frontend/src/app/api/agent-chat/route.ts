import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input, conversation_id } = body;

    if (!input) {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      );
    }

    const kibanaUrl = process.env.KIBANA_URL;
    const apiKey = process.env.ELASTICSEARCH_API_KEY;
    
    if (!kibanaUrl || !apiKey) {
      return NextResponse.json(
        { error: 'Elasticsearch environment variables not configured' },
        { status: 500 }
      );
    }
    
    const agentUrl = `${kibanaUrl}/api/agent_builder/converse/async`;
    
    const payload: { input: string; agent_id: string; conversation_id?: string } = {
      "input": input,
      "agent_id": "slides-agent"
    };
    
    if (conversation_id) {
      payload.conversation_id = conversation_id;
    }
    
    const headers = {
      "Authorization": `ApiKey ${apiKey}`,
      "Content-Type": "application/json",
      "kbn-xsrf": "true"
    };
    
    const response = await fetch(agentUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Agent API error:', errorData);
      return NextResponse.json(
        { error: errorData.message || errorData.error || `HTTP error! status: ${response.status}` },
        { status: response.status }
      );
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    let conversationId = '';
    let initialData = '';
    
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          let isFirst = true;
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            
            if (isFirst) {
              initialData += chunk;
              const dataMatch = initialData.match(/"data"\s*:\s*\{[^}]*"conversation_id"\s*:\s*"([^"]+)"/);
              if (dataMatch) {
                conversationId = dataMatch[1];
              }
              isFirst = false;
            }
            
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (error) {
          console.error('Stream error:', error);
        } finally {
          controller.close();
        }
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Conversation-Id': conversationId,
      },
    });
    
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}