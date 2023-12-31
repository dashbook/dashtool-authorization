import * as oauth from 'https://deno.land/x/oauth4webapi@v2.3.0/mod.ts'

const issuerUrl = Deno.env.get("ISSUER");
const clientId = Deno.env.get("CLIENT_ID");

const issuer = new URL(issuerUrl)
const as = await oauth
    .discoveryRequest(issuer)
    .then((response) => oauth.processDiscoveryResponse(issuer, response))

const client: oauth.Client = {
    client_id: clientId,
    token_endpoint_auth_method: 'none',
}

let refresh_token = await Deno.readTextFile("/tmp/authentication/refresh.jwt");

const parameters = new URLSearchParams()
parameters.set('scope', 'offline_access openid')

let success = await oauth.refreshTokenGrantRequest(as, client, refresh_token, parameters).then(response => response.json());

if (success.access_token && success.id_token) {
    let encoder = new TextEncoder();
    let access_data = encoder.encode(success.access_token);
    Deno.writeFile("/tmp/authorization/access.jwt", access_data);
    let id_data = encoder.encode(success.id_token);
    Deno.writeFile("/tmp/authorization/id.jwt", id_data);
} else {
    console.log("Error: ", success)
    throw new Error()
}