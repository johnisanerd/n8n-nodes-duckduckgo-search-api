import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';

/**
 * Build the Apify Actor input from node parameters.
 * Only the real Actor inputs are sent; the Output / Fields parameters shape the
 * data we return, they are not part of the Actor input. Optional fields are only
 * sent when the user provides a value so the Actor keeps its own defaults.
 */
export function buildActorInput(
	context: IExecuteFunctions,
	itemIndex: number,
	defaultInput: Record<string, any>,
): Record<string, any> {
	const input: Record<string, any> = {
		...defaultInput,
		query: context.getNodeParameter('query', itemIndex),
		localization: context.getNodeParameter('localization', itemIndex),
		safe: context.getNodeParameter('safe', itemIndex),
		max_pages: context.getNodeParameter('max_pages', itemIndex),
	};

	const dateFilter = context.getNodeParameter('date_filter', itemIndex, '') as string;
	if (dateFilter) input.date_filter = dateFilter;

	return input;
}

const resourceProperties: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Search Result',
				value: 'searchResult',
			},
		],
		default: 'searchResult',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['searchResult'],
			},
		},
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Search and return organic results',
				description: 'Search and return one item per organic result',
			},
		],
		default: 'search',
	},
];

const actorProperties: INodeProperties[] = [
	{
		displayName: 'Search Query',
		name: 'query',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. privacy tools',
		description: 'The query to search for',
		displayOptions: { show: { resource: ['searchResult'], operation: ['search'] } },
	},
	{
		displayName: 'Localization',
		name: 'localization',
		type: 'string',
		default: 'us-en',
		placeholder: 'e.g. us-en',
		description: 'Region and language code, for example us-en or uk-en',
		displayOptions: { show: { resource: ['searchResult'], operation: ['search'] } },
	},
	{
		displayName: 'Safe Search',
		name: 'safe',
		type: 'options',
		options: [
			{ name: 'Moderate', value: 'moderate' },
			{ name: 'Off', value: 'off' },
			{ name: 'Strict', value: 'strict' },
		],
		default: 'moderate',
		description: 'How strictly to filter explicit results',
		displayOptions: { show: { resource: ['searchResult'], operation: ['search'] } },
	},
	{
		displayName: 'Date Filter',
		name: 'date_filter',
		type: 'string',
		default: '',
		placeholder: 'e.g. d, w, m, y',
		description: 'Restrict results by recency: d (day), w (week), m (month), or y (year). Optional.',
		displayOptions: { show: { resource: ['searchResult'], operation: ['search'] } },
	},
	{
		displayName: 'Maximum Pages',
		name: 'max_pages',
		type: 'number',
		default: 2,
		typeOptions: { minValue: 1 },
		description: 'How many result pages to fetch',
		displayOptions: { show: { resource: ['searchResult'], operation: ['search'] } },
	},
];

const outputProperties: INodeProperties[] = [
	{
		displayName: 'Output',
		name: 'output',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['searchResult'], operation: ['search'] } },
		options: [
			{
				name: 'Raw',
				value: 'raw',
				description: 'Return every field the API produces for each result',
			},
			{
				name: 'Selected Fields',
				value: 'selected',
				description: 'Choose exactly which fields to return',
			},
			{
				name: 'Simplified',
				value: 'simplified',
				description: 'Return a compact set of the most useful result fields',
			},
		],
		default: 'simplified',
		description: 'How much data to return for each result',
	},
	{
		displayName: 'Fields to Include',
		name: 'fields',
		type: 'multiOptions',
		displayOptions: {
			show: { resource: ['searchResult'], operation: ['search'], output: ['selected'] },
		},
		options: [
			{ name: 'Date', value: 'date' },
			{ name: 'Date Raw', value: 'date_raw' },
			{ name: 'Favicon', value: 'favicon' },
			{ name: 'Link', value: 'link' },
			{ name: 'Position', value: 'position' },
			{ name: 'Snippet', value: 'snippet' },
			{ name: 'Title', value: 'title' },
		],
		default: ['position', 'title', 'link', 'snippet', 'date'],
		description: 'Which fields to return when Output is set to Selected Fields',
	},
];

const authenticationProperties: INodeProperties[] = [
	{
		displayName: 'Authentication',
		name: 'authentication',
		type: 'options',
		options: [
			{
				name: 'API Key',
				value: 'apifyApi',
			},
			{
				name: 'OAuth2',
				value: 'apifyOAuth2Api',
			},
		],
		default: 'apifyApi',
		description: 'Choose which authentication method to use',
	},
];

export const properties: INodeProperties[] = [
	...resourceProperties,
	...actorProperties,
	...outputProperties,
	...authenticationProperties,
];
