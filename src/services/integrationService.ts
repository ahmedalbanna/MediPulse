export interface Integration {
  id: string;
  name: string;
  description: string;
  type: 'HIS' | 'Payment' | 'Insurance' | 'SMS' | 'API';
  status: 'Active' | 'Inactive' | 'Pending' | 'Error';
  lastSync?: string;
  config: any;
}

export const integrationService = {
  getIntegrations: async (): Promise<Integration[]> => {
    const response = await fetch('/api/integrations');
    return response.json();
  },

  updateIntegration: async (id: string, config: any): Promise<Integration> => {
    const response = await fetch(`/api/integrations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return response.json();
  },

  testConnection: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`/api/integrations/${id}/test`, { method: 'POST' });
    return response.json();
  },

  getApiDocs: async (): Promise<any> => {
    const response = await fetch('/api/integrations/docs');
    return response.json();
  }
};
