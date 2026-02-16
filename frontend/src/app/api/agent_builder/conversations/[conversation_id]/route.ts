import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversation_id: string }> }
) {
  try {
    const { conversation_id } = await params;

    const kibanaUrl = process.env.KIBANA_URL;
    const apiKey = process.env.ELASTICSEARCH_API_KEY;

    if (!kibanaUrl || !apiKey) {
      return NextResponse.json(
        { error: 'Elasticsearch environment variables not configured' },
        { status: 500 }
      );
    }

    const agentUrl = `${kibanaUrl}/api/agent_builder/conversations/${conversation_id}`;

    const headers = {
      'Authorization': `ApiKey ${apiKey}`,
      'Content-Type': 'application/json',
      'kbn-xsrf': 'true'
    };

    const response = await fetch(agentUrl, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Get conversation error:', errorData);
      return NextResponse.json(
        { error: errorData.message || errorData.error || `HTTP error! status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversation_id: string }> }
) {
  try {
    const { conversation_id } = await params;
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
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

    const agentUrl = `${kibanaUrl}/api/agent_builder/conversations/${conversation_id}`;

    const headers = {
      'Authorization': `ApiKey ${apiKey}`,
      'Content-Type': 'application/json',
      'kbn-xsrf': 'true'
    };

    const response = await fetch(agentUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Save conversation error:', errorData);
      return NextResponse.json(
        { error: errorData.message || errorData.error || `HTTP error! status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ conversation_id: string }> }
) {
  try {
    const { conversation_id } = await params;

    const kibanaUrl = process.env.KIBANA_URL;
    const apiKey = process.env.ELASTICSEARCH_API_KEY;

    if (!kibanaUrl || !apiKey) {
      return NextResponse.json(
        { error: 'Elasticsearch environment variables not configured' },
        { status: 500 }
      );
    }

    const agentUrl = `${kibanaUrl}/api/agent_builder/conversations/${conversation_id}`;

    const headers = {
      'Authorization': `ApiKey ${apiKey}`,
      'Content-Type': 'application/json',
      'kbn-xsrf': 'true'
    };

    const response = await fetch(agentUrl, {
      method: 'DELETE',
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Delete conversation error:', errorData);
      return NextResponse.json(
        { error: errorData.message || errorData.error || `HTTP error! status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
