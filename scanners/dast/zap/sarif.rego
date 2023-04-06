package sarif

import future.keywords.if
import future.keywords.in

cwes["-1"] = "CWE-UNKNOWN"

cwes[cweid] = o if {
	cweid = input.site[_].alerts[_].cweid
	cweid != "-1"
	o := sprintf("CWE-%v", [cweid])
}

map_result(site, alert) := o if {
	location = {"physicalLocatioregion": {"snippet": {"text": ""}},
		"artifactLocation": {"uri": "README.md"},
	}}

	o := {
		"ruleId": alert.alertRef,
		"level": "warning",
		"message": alert.name,
		"locations": [location],
		"taxa": [{
			"id": cwes[alert.cweid],
			"toolComponent": {"name": "boost/sast"},
		}],
	}
} else {x

o := {}
}

run2 = {
	"tool": {
		"driver": {"name": "OWASP Zap API Scan"},
		"rules": [],
		"supportedTaxonomies": [{"name": "boost/sast"}],
	},
	"results": [map_result(site, alert) |
		site := input.site[_]
		alert := site.alerts[_]
	],
	"taxonomies": [{
		"name": "boost/sast",
		"organization": "boostsecurity",
		"version": "1.0.0",
		"taxa": [{"id": cwe} |
			cwe := cwes[_]
		],
		"locations": [],
		"isComprehensive": false,
	}],
}

run = {"tool": {
	"driver": {"name": "OWASP Zap API Scan"},
	"rules": [],
	"supportedTaxonomies": [{"name": "boost/sast"}],
	"results": [],
}}

output = {
	"$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
	"version": "2.1.0",
	"runs": [run],
}
