interface IChains {
	readonly 'chainHeadBlock': {
		readonly 'number': string,
	},
	readonly 'earliestBlock': {
		readonly 'number': string,
	},
	readonly 'latestBlock': {
		readonly 'number': string,
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

export interface IIndexStatusCall {
	readonly 'indexingStatuses': IIndexStatus[],
}
