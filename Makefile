DEEP_PREF=../..
CONVERSION_SCRIPT=script/linkml.py

.PHONY: all clean mixs nmdc canada_covid19

all: clean template/*/schema.js
mixs: clean template/MIxS/schema.js
nmdc: clean template/nmdc_dh/schema.js
canada_covid19: clean template/canada_covid19/schema.js

clean:
	rm -rf template/menu.js

	rm -rf template/canada_covid19/schema.js
	rm -rf template/MIxS/schema.js
	rm -rf template/nmdc_dh/schema.js
	rm -rf template/nmdc_dh/source/nmdc_dh.yaml


template/nmdc_dh/source/nmdc_dh.yaml:
	wget -O $@ https://raw.githubusercontent.com/microbiomedata/sheets_and_friends/main/artifacts/nmdc_dh.yaml

template/MIxS/schema.js: template/MIxS/source/mixs.yaml
	$(eval DIRNAME=$(shell dirname $@))
	cd $(DIRNAME) ; python3 $(DEEP_PREF)/$(CONVERSION_SCRIPT) --input $(DEEP_PREF)/$<
	# now open linkml.html in a web browser

template/nmdc_dh/schema.js: template/nmdc_dh/source/nmdc_dh.yaml
	$(eval DIRNAME=$(shell dirname $@))
	cd $(DIRNAME) ; python3 $(DEEP_PREF)/$(CONVERSION_SCRIPT) --input $(DEEP_PREF)/$<
	# now open linkml.html in a web browser

template/canada_covid19/schema.js: template/canada_covid19/schema.yaml
	$(eval DIRNAME=$(shell dirname $@))
	cd $(DIRNAME) ; python3 $(DEEP_PREF)/$(CONVERSION_SCRIPT) --input $(DEEP_PREF)/$<
	# now open linkml.html in a web browser
