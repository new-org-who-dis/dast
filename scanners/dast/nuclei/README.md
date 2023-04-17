# `dast/nuclei`

Module to run Nuclei using default rules.

``` yaml
      - id: get-ip
        run: |
          HOST=`ip -4 addr show docker0 | grep -Po 'inet \K[\d.]+'`
          echo "HOST=$HOST" >> $GITHUB_OUTPUT
          
      - name: dast/nuclei
        uses: boostsecurityio/boostsec-scanner-github@v4
        env:
          TARGET_URL: "http://${{steps.get-ip.outputs.HOST}}:3001/graphql"
        with:
          api_token: ${{ secrets.BOOST_API_TOKEN }}
          api_endpoint: https://api.dev.boostsec.io
          registry_module: dast/nuclei
          additional_args: --registry .
          log_level: DEBUG

```
