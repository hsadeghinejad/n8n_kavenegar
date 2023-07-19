import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class KavenegarSMS implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Kavenegar SMS',
    name: 'kavenegarSMS',
    icon: 'file:kavenegar.svg',
    group: ['output'],
    version: 1,
    description: 'Send an SMS through Kavenegar API',
    defaults: {
      name: 'Kavenegar SMS',
      color: '#772244',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'kavenegarApi',
        required: true,
      },
    ],
    operationOptions: [
      {
        name: 'sendSMS',
        description: 'Send an SMS',
        parameters: [
          {
            name: 'cell',
            type: 'string',
            description: 'Cell number to send the SMS',
            required: true,
          },
          {
            name: 'text',
            type: 'string',
            description: 'The text to be sent in the SMS',
            required: true,
          },
          {
            name: 'pattern',
            type: 'string',
            description: 'The pattern to be used for the SMS',
            required: true,
          },
        ],
        execute: async ({ operationParameters, context }) => {
          const { cell, text, pattern } = operationParameters;

          const credentials = context.getCredentials('kavenegarApi');

          if (credentials === undefined) {
            throw new Error('No credentials got returned!');
          }

          const apiKey = credentials.apiKey as string;

          const responseData = await context.helpers.request({
            method: 'POST',
            url: `https://api.kavenegar.com/v1/${apiKey}/sms/send.json`,
            body: {
              receptor: cell,
              message: text,
              pattern_code: pattern,
            },
            json: true,
          });

          if (responseData[0].return.status !== 200) {
            throw new Error('Kavenegar API request failed. Response: ' + responseData[0].return.status);
          }

          return [responseData];
        },
      },
    ],
  };
}
