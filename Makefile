DEEP_PREF=../..
CONVERSION_SCRIPT=script/linkml.py

.PHONY: all clean

all: clean template/MIxS/schema.js

clean:
	rm -rf template/menu.js
	rm -rf template/MIxS/schema.js

template/MIxS/schema.js: template/MIxS/source/mixs.yaml
	$(eval DIRNAME=$(shell dirname $@))
	cd $(DIRNAME) ; python $(DEEP_PREF)/$(CONVERSION_SCRIPT) --input $(DEEP_PREF)/$<
	# now open linkml.html in a web browser