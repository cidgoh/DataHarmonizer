# for following workflow, must first create MIxS LinkML
#   from main branch of forked https://github.com/turbomam/mixs-source

# (moves "patterns" to string serializastions and removes some comments)
#   rm -rf model/schema/*yaml
#   make model/schema/mixs.yaml

# check with
#   pipenv run gen-yaml model/schema/mixs.yaml | less

# still having trouble instantiating annotations for what used to be comments
#   Occurrence, "This field is used..."
# yaml.representer.RepresenterError: ('cannot represent an object', JsonObj(Occurrence=Annotation(tag='Occurrence', value='', extensions={}, annotations={})))

.PHONY: all clean serializastion_vs_pattern negative_case

all: clean serializastion_vs_pattern target/data.tsv

clean:
	rm -rf target/mixs_soil.yaml
	rm -rf target/nmdc_biosample.yaml
	rm -rf target/soil_biosample*
	rm -rf target/data.tsv

# this LinkML to DataHarmonizer workflow doesn't want stuff like {PMID}|{DOI}|{URL} in "patterns"
# egrep may not behave the same way on all systems
serializastion_vs_pattern:
	egrep "string_serialization:.*{PMID}|{DOI}|{URL}" ../mixs-source/model/schema/terms.yaml

# demonstrating that a failed step terminates the make process
negative_case:
	egrep "string_serialization:.*oh my darling" ../mixs-source/model/schema/*yaml

target/mixs_soil.yaml:../mixs-source/model/schema/mixs.yaml
	poetry run get_dependencies \
		--model_file $< \
		--selected_class soil > $@

target/nmdc_biosample.yaml:../nmdc-schema/src/schema/nmdc.yaml
	poetry run get_dependencies \
		--model_file $< \
		--selected_class biosample > $@

target/nmdc_biosample_generated.yaml: target/nmdc_biosample.yaml
	poetry run gen-yaml $< > $@ 2> $@.log

# oops imports can't be found ???
# merge_dont_interleave isn't splicing all dicts in (eg for slot usage)
# rules are pretty MIxS/NMDC specific right now and expect the model in that order
# todo: using target/nmdc_biosample_generated.yaml as input here
#   forces the inclusion of reasonable slot uris, but also forces in-lining of enums?
#   should put slot uri generation code in get_dependencies
target/soil_biosample.yaml:target/mixs_soil.yaml target/nmdc_biosample_generated.yaml
	poetry run merge_dont_interleave \
		--model_file1 target/mixs_soil.yaml \
		--model_file2 target/nmdc_biosample.yaml \
		--output $@


target/soil_biosample_interleaved.yaml: target/soil_biosample.yaml
	#poetry run python linkml_round_trips/interleave_mergeds.py
	poetry run interleave_mergeds \
		--model_file=$< \
		--class1 "soil" \
		--class2 "biosample" \
		--source_name1 "MIxS" \
		--source_name2 "NMDC" \
		--output $@
	# can check the validity of any LinkML file (and generate a more explicit version?) with gen-yaml
	poetry run gen-yaml \
		target/soil_biosample_interleaved.yaml > target/soil_biosample_interleaved_generated.yaml \
			2> target/soil_biosample_interleaved_generated.log

# if range is one of the enums, then pattern is probably a string serialization
#   *something* along those lines is being checked in linkml_to_dh_light.py, but that should be moved into make model/schema/mixs.yaml
target/data.tsv: target/soil_biosample_interleaved.yaml
	poetry run linkml_to_dh_light \
		--model_file $< \
		--selected_class soil_biosample_class \
		--output_file=$@

templating_handoff: target/data.tsv
	cp $< ../DataHarmonizer/template/dev
	cp target/soil_biosample_interleaved.yaml ../DataHarmonizer/template/dev


# manually run when ready:
#   make templating_handoff
# now open a terminal in ../DataHarmonizer and setup or activate the venv
# then cd to template/dev
# and run:
#   python ../../script/make_data.py
# may want to work on related files like SOP.pdf, reference_template.html (before make_data.py?)
# todo: work on data.tsv and export.js so that the export operation with DH exports a file using
#   the EXPORT-designated column headings (linkml names), not the DH labels (linkml titles)
# todo: provide more valid and invalid example data files in exampleInput
# add, commit and push to GH (with GH pages enabled) so that people can see the results at
#   https://turbomam.github.io/DataHarmonizer/main.html
# requirements for that:
#   *using code from main DH branch as of early Dec 2021*:
#     edit the const TEMPLATES in script/main.js to refect what templates are avaialble, how they should be labelled and tagged for publication vs draft
#     update the definition of template_label (let template_label) to reflect the label of the desired default template
#   go to the GH pages setup screen eg https://github.com/org/repo/settings/pages
#     ensure that the pages are being buit from the root of the master/main branch


# DH tempalte creation thought: slots with identifier=True are now required/unique. Now move to left hand side of template

# general makefile thought: try using $(word 2,$^) for 2nd and later dependencies

####


target/mixs_package_classes.tsv:
	poetry run mixs_package_classes \
		--model_file ../mixs-source/model/schema/mixs.yaml
