package sarif

import future.keywords.if
import future.keywords.in

map_result(r) := o if {
	o := {
		"ruleId": r.ruleId,
		"level": r.level,
		"message": r.message,
		"locations": [{"physicalLocation": {"region": {"text": "something"}, "artifactLocation": {"uri": "http://localhost:3000/"}}}],
	}
}

run = {
	"tool": input.runs[0].tool,
	"results": [map_result(r) | r := input.runs[0].results[_]],
}

output = {
	"$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
	"version": "2.1.0",
	"runs": [run],
}
