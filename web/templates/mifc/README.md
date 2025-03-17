This contains the Minimum Information about Food Composition LinkML specification available at: https://github.com/kaiiam/mifc and documented at https://kaiiam.github.io/mifc/ .

The schema.yaml file is a copy of https://github.com/kaiiam/mifc/blob/main/src/mifc/schema/mifc.yaml

Since DataHarmonizer uses the schema.json version, to generate schema.json from schema.yaml, on a command line terminal, navigate to DataHarmonizer /web/templates/mifc/ and type:

> python3 ../../../script/linkml.py -i schema.yaml -m"

The -m parameter adds this template to the menu system ../menu.js for the stand-alone DataHarmonizer to display.