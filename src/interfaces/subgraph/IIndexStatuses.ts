interface IChains {
	'chainHeadBlock': {
		'number': string,
	},
	'earliestBlock': {
		'number': string,
	},
	'latestBlock': {
		'number': string,
	}
}

interface IIndexStatus {
	readonly 'subgraph': string,
	readonly 'synced': boolean,
	readonly 'health': string,
	readonly 'entityCount': string,
	readonly 'fatalError': any,
	readonly 'chains': IChains[],
}

export interface IIndexStatues {
	readonly 'indexingStatuses': IIndexStatus[],
}
