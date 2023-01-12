INSERT INTO gro."PROTOCOL_APY" (
        "current_timestamp",
        "current_date",
        "network_id",
        "product_id",
        "apy_last24h",
        "apy_last7d",
        "apy_daily",
        "apy_weekly",
        "apy_monthly",
        "apy_all_time",
        "apy_current",
        "creation_date"
    )
    VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12
    )