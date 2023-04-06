import json
import sys
import re

input = json.load(sys.stdin)


def scrub_html(s, r=re.compile(r"<[^>]+>")):
    return r.sub("", s)


def cwe(cweid):
    if cweid == "-1":
        return "CWE-UNKNOWN"
    else:
        return f"CWE-{cweid}"


def result(site, alert):
    return {
        "ruleId": alert["alertRef"],
        "message": {
            "text": "\n\n".join(
                [
                    f'{alert["name"]} on {site["@name"]}',
                    f'{scrub_html(alert["desc"])}',
                    f'Solution: {scrub_html(alert["solution"])}',
                    f'References: {scrub_html(alert["reference"])}',
                ]
            )
        },
        "taxa": [
            {
                "id": cwe(alert["cweid"]),
                "toolComponent": {"name": "boost/sast"},
            }
        ],
        "locations": [
            {
                "physicalLocation": {
                    "artifactLocation": {"uri": ".github/workflows/zap.yml"},
                    "region": {"snippet": {"text": ""}},
                },
            }
        ],
    }


def rule(site, alert):
    return {
        "id": alert["alertRef"],
        "shortDescription": {"text": alert["name"]},
        "relationships": [
            {
                "target": {
                    "id": cwe(alert["cweid"]),
                    "toolComponent": {"name": "boost/sast"},
                },
                "kinds": ["relevant"],
            }
        ],
    }


run = {
    "tool": {
        "driver": {
            "name": "OWASP Zap API Scan",
            "rules": [
                rule(site, alert) for site in input["site"] for alert in site["alerts"]
            ],
        },
    },
    "results": [
        result(site, alert) for site in input["site"] for alert in site["alerts"]
    ],
}

sarif = {
    "$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
    "version": "2.1.0",
    "runs": [run],
}

print(json.dumps(sarif, indent=2))
