The following command line operations can be run from the oca_test folder:

python3 oca_to_linkml.py -i CCASM_OCA_package.json -o CCASM_LinkML; cd CCASM_LinkML; python3 ../../../../script/tabular_to_schema.py; cd ..;
python3 oca_to_linkml.py -i ACTIVATE-act2.3.oca.json -o ACTIVATE_LinkML; cd ACTIVATE_LinkML; python3 ../../../../script/tabular_to_schema.py; cd ..;
python3 oca_to_linkml.py -i  Community_OCA_package.json -o Community_LinkML; cd Community_LinkML; python3 ../../../../script/tabular_to_schema.py; cd ..;
python3 oca_to_linkml.py -i BENEFIT_OCA_package.json -o BENEFIT_LinkML; cd BENEFIT_LinkML; python3 ../../../../script/tabular_to_schema.py; cd ..;
python3 oca_to_linkml.py -i PeaCE_OCA_package_Final.json -o PeaCE_LinkML; cd PeaCE_LinkML; python3 ../../../../script/tabular_to_schema.py; cd ..;
