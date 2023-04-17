# `dast/zap`

Module to run an OWASP Zap API scan.

``` yaml
      - id: get-ip
        run: |
          HOST=`ip -4 addr show docker0 | grep -Po 'inet \K[\d.]+'`
          echo "HOST=$HOST" >> $GITHUB_OUTPUT
          
      - name: dast/zap
        uses: boostsecurityio/boostsec-scanner-github@v4
        env:
          TARGET_URL: "http://${{steps.get-ip.outputs.HOST}}:3001/graphql"
          API_FORMAT: graphql
          ZAP_AUTH_HEADER_VALUE: "Bearer ed62b1b3a68594c9f9a2a6a1a87ba14730a0457b"
          ZAP_AUTH_HEADER: Authorization
        with:
          api_token: ${{ secrets.BOOST_API_TOKEN }}
          api_endpoint: https://api.dev.boostsec.io
          registry_module: dast/zap
          additional_args: --registry .
          log_level: DEBUG
          cli_version: 1.0.0.dev0%2b2d40655

```
