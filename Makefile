DEEP_PREFIX=../../
LINKML_2

.PHONY: all clean

all: clean template/MIxS/schema.js

clean:
	rm -rf template/menu.js
	rm -rf template/MIxS/schema.js

template/MIxS/schema.js: template/MIxS/source/mixs.yaml
	$(eval DIRNAME=$(shell dirname $@))
	cd $(DIRNAME) ; python ../../script/linkml.py --input ../../$<
	# now open linkml.html in a web browser