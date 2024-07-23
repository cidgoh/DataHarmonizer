DEEP_PREF=../../..
CONVERSION_SCRIPT=script/linkml.py
TEMPLATES_DIR=web/templates

.PHONY: all clean mixs nmdc canada_covid19

all: clean $(TEMPLATES_DIR)/*/schema.json
mixs: clean $(TEMPLATES_DIR)/MIxS/schema.json
nmdc: clean $(TEMPLATES_DIR)/nmdc_dh/schema.json
canada_covid19: clean $(TEMPLATES_DIR)/canada_covid19/schema.json

clean:
	rm -rf $(TEMPLATES_DIR)/manifest.json
	rm -rf $(TEMPLATES_DIR)/menu.json
	rm -rf $(TEMPLATES_DIR)/canada_covid19/schema.json
	rm -rf $(TEMPLATES_DIR)/MIxS/schema.json
	rm -rf $(TEMPLATES_DIR)/nmdc_dh/schema.json
	rm -rf $(TEMPLATES_DIR)/nmdc_dh/source/nmdc_dh.yaml


$(TEMPLATES_DIR)/nmdc_dh/source/nmdc_dh.yaml:
	wget -O $@ https://raw.githubusercontent.com/microbiomedata/sheets_and_friends/main/artifacts/nmdc_dh.yaml

$(TEMPLATES_DIR)/MIxS/schema.json: $(TEMPLATES_DIR)/MIxS/source/mixs.yaml
	$(eval DIRNAME=$(shell dirname $@))
	cd $(DIRNAME) ; python3 $(DEEP_PREF)/$(CONVERSION_SCRIPT) --input $(DEEP_PREF)/$<

$(TEMPLATES_DIR)/nmdc_dh/schema.json: $(TEMPLATES_DIR)/nmdc_dh/source/nmdc_dh.yaml
	$(eval DIRNAME=$(shell dirname $@))
	cd $(DIRNAME) ; python3 $(DEEP_PREF)/$(CONVERSION_SCRIPT) --input $(DEEP_PREF)/$<

$(TEMPLATES_DIR)/canada_covid19/schema.json: $(TEMPLATES_DIR)/canada_covid19/schema.yaml
	$(eval DIRNAME=$(shell dirname $@))
	cd $(DIRNAME) ; python3 $(DEEP_PREF)/$(CONVERSION_SCRIPT) --input $(DEEP_PREF)/$<
