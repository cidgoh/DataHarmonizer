.PHONY: all clean test post_clone_submodule_steps serializastion_vs_pattern negative_case

target/soil_biosample_modular.yaml: clean  post_clone_submodule_steps serializastion_vs_pattern
	poetry run python use_modular_gd.py > $@
	poetry run linkml_to_dh_light --model_file target/soil_biosample_modular.yaml --selected_class soil_biosample

# test needs work
all: clean  post_clone_submodule_steps serializastion_vs_pattern target/data.tsv

clean:
	rm -rf target/mixs_soil.yaml
	rm -rf target/nmdc_biosample.yaml
	rm -rf target/soil_biosample*
	rm -rf target/data.tsv

test:
	poetry run pytest -vv test_sntc.py

# turbomam's mixs-source
#   moves "patterns" to string serializastions
#   removes some comments
#   still having trouble instantiating annotations for what used to be comments about Occurrence, "This field is used..."
# yaml.representer.RepresenterError: ('cannot represent an object', JsonObj(Occurrence=Annotation(tag='Occurrence', value='', extensions={}, annotations={})))
#
# does anything bad happen if we do this routinely?
post_clone_submodule_steps:
	git submodule init
	git submodule update

# this LinkML to DataHarmonizer workflow doesn't want stuff like {PMID}|{DOI}|{URL} in "patterns"
# egrep may not behave the same way on all systems
serializastion_vs_pattern:
	egrep "string_serialization:.*{PMID}|{DOI}|{URL}" mixs-source/model/schema/terms.yaml

# demonstrating that a failed step terminates the make process
negative_case:
	egrep "string_serialization:.*oh my darling" ../mixs-source/model/schema/*yaml

target/mixs_soil.yaml:mixs-source/model/schema/mixs.yaml
	poetry run get_dependencies \
		--model_file $< \
		--selected_class soil > $@

target/nmdc_biosample.yaml:nmdc-schema/src/schema/nmdc.yaml
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
#   should put slot uri generation code in get_dependencies (DONE?)

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
	cp $< template/dev
	cd template/dev && poetry run python ../../script/make_data.py && cd -
	cp -r images docs
	cp -r libraries docs
	cp -r script docs
	cp -r template docs
	cp main.css main.html docs

target/mixs_package_classes.tsv:
	poetry run mixs_package_classes \
		--model_file ../mixs-source/model/schema/mixs.yaml


# manually run when ready:
#   make templating_handoff
# add, commit and push to GH (with GH pages enabled) so that people can see the results at
#   https://turbomam.github.io/DataHarmonizer/main.html

#   go to the GH pages setup screen eg https://github.com/org/repo/settings/pages
#     ensure that the pages are being buit from the docs folder in  the master/main branch

# todo may want to work on related files like SOP.pdf, reference_template.html (before make_data.py?)

# todo: check export results
#   the column headers in the exported file should use slot names, not slot titles
#   corresponding to mixs_6_slot_name (etc)  and "Column Header" from the Soil-NMDC-Template_Compiled google sheet
#   or EXPORT_dev and label from the DH template
# data.tsv has an EXPORT_dev column populated with slot names
# export.js was pasted in based a default-case advice from Damion

# todo: slots with identifier=True are now required/unique. check that they appear on the left hand side of template

# todo: provide more valid and invalid example data files in exampleInput

#   static deviations vs  cidgoh/DataHarmonizer, based on their main branch as of early Dec 2021:
#     edited the const TEMPLATES in script/main.js to refect what templates are avaialble,
#       how they should be labelled and tagged for publication vs draft
#     updated the definition of template_label (let template_label) to reflect the label of the desired default template

# general makefile thought: try using $(word 2,$^) for 2nd and later dependencies
