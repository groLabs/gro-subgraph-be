export const queryBotStatus = () => (
    `{
        _meta {
            hasIndexingErrors
            block {
              number
            }
        }
        masterDatas {
            network_id
            launch_timestamp
        }
    }`
);
