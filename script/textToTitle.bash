#!usr/bin/env sh
jq 'walk(if type == "object" and has("permissible_values") then .permissible_values |= map_values(.text = .title) else . end)' schema.json >> schema.mod.json