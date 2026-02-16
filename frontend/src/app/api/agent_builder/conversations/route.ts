import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const kibanaUrl = process.env.KIBANA_URL;
    const apiKey = process.env.ELASTICSEARCH_API_KEY;

    if (!kibanaUrl || !apiKey) {
      return NextResponse.json(
        { error: 'Elasticsearch environment variables not configured' },
        { status: 500 }
      );
    }

    const agentUrl = `${kibanaUrl}/api/agent_builder/conversations`;

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
      console.error('List conversations error:', errorData);
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
