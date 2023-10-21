
Subgraph bot
---

TheGraph's hosted service was capable of providing data through API requests without requiring any keys, allowing any front-end to retrieve data directly from subgraphs without necessitating a back-end.

However, this hosted service is set to be phased out in 2023, and only subgraphs published on their decentralized network will have the capability to serve data through a paid API key. Consequently, having a back-end will be essential to securely manage the API key and serve data to our front-end from Gro's subgraphs.

A new Node.js bot, fully developed in TypeScript, has been implemented to facilitate this data flow, with the following configuration:


<table data-layout="default" data-local-id="de2e0d92-2355-459c-85ee-fa42f8223371" class="confluenceTable">
    <colgroup>
        <col style="width: 185.0px;">
        <col style="width: 573.0px;">
    </colgroup>
    <tbody>
        <tr>
            <td class="confluenceTd">
                <p>Host</p>
            </td>
            <td class="confluenceTd">
                <p><a href="https://brrr.atlassian.net/wiki/spaces/GP/pages/384139265/gro+Linux+Hosts#Current-Hosts"
                        rel="nofollow">msb2</a></p>
            </td>
        </tr>
        <tr>
            <td class="confluenceTd">
                <p>Port</p>
            </td>
            <td class="confluenceTd">
                <p>3015</p>
            </td>
        </tr>
        <tr>
            <td class="confluenceTd">
                <p>Gateway</p>
            </td>
            <td class="confluenceTd">
                <p><a href="https://fxcnkxnki8.execute-api.eu-west-2.amazonaws.com/subgraph/gro_personal_position_mc?address=0x60ff7dcb4a9c1a89b18fa2d1bb9444143bbea9bd&amp;subgraph=prod_hosted"
                        class="external-link"
                        rel="nofollow">https://fxcnkxnki8.execute-api.eu-west-2.amazonaws.com/subgraph/gro_personal_position_mc?address=0x…&amp;subgraph=prod_hosted</a>
                </p>
            </td>
        </tr>
        <tr>
            <td class="confluenceTd">
                <p>Host folder</p>
            </td>
            <td class="confluenceTd">
                <p>~/gro/subgraph/</p>
            </td>
        </tr>
        <tr>
            <td class="confluenceTd">
                <p>Start command</p>
            </td>
            <td class="confluenceTd">
                <p><code>pm2 start npm --name "gro-subgraph" -- run "start:prod"</code></p>
            </td>
        </tr>
        <tr>
            <td class="confluenceTd">
                <p>Repository</p>
            </td>
            <td class="confluenceTd">
                <p><a href="https://github.com/groLabs/gro-subgraph-be" data-card-appearance="inline"
                        class="external-link" rel="nofollow">https://github.com/groLabs/gro-subgraph-be</a></p>
            </td>
        </tr>
    </tbody>
</table>