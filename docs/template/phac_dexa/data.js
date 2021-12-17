var DATA = [
  {
    "fieldName": "Database Identifiers",
    "children": [
      {
        "fieldName": "SPECIMEN_ID",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "exportField": {
          "GRDI": [
            {
              "field": "alternative_sample_ID"
            }
          ]
        }
      },
      {
        "fieldName": "ISOLATE_ID",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "",
        "guidance": "",
        "examples": "",
        "exportField": {
          "GRDI": [
            {
              "field": "isolate_ID"
            }
          ]
        }
      },
      {
        "fieldName": "SAMPLE_ID",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "",
        "guidance": "",
        "examples": "",
        "exportField": {
          "GRDI": [
            {
              "field": "sample_collector_sample_ID"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "Fields to put in sections",
    "children": [
      {
        "fieldName": "SENTINEL_SITE",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "LFZ_ADDITIONAL_SAMPLE_ID",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "LFZ_ORIGIN_COUNTRY",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "SUBJECT_CODE",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "SUBJECT_DESCRIPTIONS",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "schema:ItemList": {
          "1/2 breast": {
            "ontology_id": "UBERON_0000310",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Avian Ingredients": {
            "ontology_id": "FOODON_00002616",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Back": {
            "ontology_id": "PATO_0001901",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Balut": {
            "ontology_id": "FOODON_03302184",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Black Pepper": {
            "ontology_id": "FOODON_03411191",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Blade Steak": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Blood Meal": {
            "ontology_id": "FOODON_00001564",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Bone Meal": {
            "ontology_id": "ENVO_02000054",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Bovine Ingredients": {
            "ontology_id": "FOODON_03414374",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Breast": {
            "ontology_id": "UBERON_0000310",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Breast back off": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Breast cutlets": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Breast Skinless": {
            "ontology_id": "UBERON_0000310",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Breast Skinless Boneless": {
            "ontology_id": "UBERON_0000310",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Breast with Skin": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Brisket": {
            "ontology_id": "FOODON_03530020",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Burger": {
            "ontology_id": "FOODON_00002737",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Calf": {
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Canola Meal": {
            "ontology_id": "FOODON_00002694",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Carinata Meal": {
            "ontology_id": "FOODON_03316468",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Chop": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Chops": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "coli": {},
          "Complete Feed": {
            "ontology_id": "FOODON_03309997",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Corn": {
            "ontology_id": "FOODON_00001765",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Cow": {
            "ontology_id": "FOODON_03411161",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Cubes": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Cutlet": {
            "ontology_id": "FOODON_00003001",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Drumstick": {
            "ontology_id": "CURATION_0001378",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Drumstick Skinless": {
            "ontology_id": "CURATION_0001378",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Drumstick with Skin": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Drumsticks": {
            "ontology_id": "CURATION_0001378",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Egg Flour": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Feather Meal": {
            "ontology_id": "CURATION_0001357",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Feed": {
            "ontology_id": "FOODON_03309997",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Filet": {
            "ontology_id": "FOODON_03530144",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Fish Ingredients": {
            "ontology_id": "FOODON_03411222",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Fish Meal": {
            "ontology_id": "FOODON_03301620",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Grain": {
            "ontology_id": "FOODON_03311095",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ground": {
            "ontology_id": "FOODON_03430136",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ground ( lean)": {
            "ontology_id": "FOODON_03430136",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ground (Angus)": {
            "ontology_id": "FOODON_03430136",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ground (Extra Lean)": {
            "ontology_id": "FOODON_03430136",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ground (extra-lan)": {
            "ontology_id": "FOODON_03430136",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ground (Extra-Lean)": {
            "ontology_id": "FOODON_03430136",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ground (Lean)": {
            "ontology_id": "FOODON_03430136",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ground (Medium)": {
            "ontology_id": "FOODON_03430117",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ground (Regular)": {
            "ontology_id": "FOODON_03430136",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ground (Sirloin)": {
            "ontology_id": "CURATION_0001614",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ground Boneless": {
            "ontology_id": "FOODON_03430136",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ground extra lean": {
            "ontology_id": "FOODON_03430136",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ground regular": {
            "ontology_id": "FOODON_03430136",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "ground( extra lean)": {
            "ontology_id": "FOODON_03430136",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "ground( medium)": {
            "ontology_id": "FOODON_03430117",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ground(Extra lean)": {
            "ontology_id": "FOODON_03430136",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ground(Lean)": {
            "ontology_id": "FOODON_03430136",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ground(medium)": {
            "ontology_id": "FOODON_03430117",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "ground(regular)": {
            "ontology_id": "FOODON_03430136",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Groundextra lean)": {
            "ontology_id": "FOODON_03430136",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ground-Lean": {
            "ontology_id": "FOODON_03430136",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ground-Regular": {
            "ontology_id": "FOODON_03430136",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Heifer": {
            "ontology_id": "FOODON_00002518",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Hummus": {
            "ontology_id": "FOODON_00003049",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "In-Shell": {
            "ontology_id": "UBERON_0006612",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Lay Ration": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Leg": {
            "ontology_id": "UBERON_0000978",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Leg with Skin-Drumstick and Thigh": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Liver": {
            "ontology_id": "UBERON_0002107",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Loin Center Chop": {
            "ontology_id": "FOODON_03530031",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Meat and Bone Meal": {
            "ontology_id": "FOODON_00002738",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Meat Flour/Meal": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Meat Meal": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Mild italian style burger": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Necks": {
            "ontology_id": "UBERON_0000974",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Nuggets": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Other": {
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Other cut": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Other Cut (Not Ground)": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Other Cut Boneless": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Other Cut Boneless (Not Ground)": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ovine Ingredients": {
            "ontology_id": "FOODON_03411183",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Pet Food": {
            "ontology_id": "FOODON_00002682",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Porcine Ingredients": {
            "ontology_id": "FOODON_03411136",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Pork Chop (Cut Unknown)": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Premix": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Premix (Medicated)": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Processed (Other)": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Raw": {
            "ontology_id": "FOODON_03311126",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Rib Chop": {
            "ontology_id": "UBERON_0002228",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ribs": {
            "ontology_id": "UBERON_0002228",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Roast": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Salami": {
            "ontology_id": "FOODON_03312067",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Sausage": {
            "ontology_id": "FOODON_03315904",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Sausage (Pepper)": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Scallopini": {
            "ontology_id": "FOODON_00003017",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Shell on": {
            "ontology_id": "UBERON_0006612",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Shelled": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Shoulder": {
            "ontology_id": "UBERON_0001467",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Shoulder Chop": {
            "ontology_id": "UBERON_0001467",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Sirloin Chop": {
            "ontology_id": "FOODON_03530027",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Skim milk powder": {
            "ontology_id": "FOODON_03301484",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Soft": {
            "ontology_id": "PATO_0000387",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Soyabean Meal": {
            "ontology_id": "FOODON_03316468",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Starter Ration": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Steak": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Stew Chunks": {
            "ontology_id": "FOODON_00003140",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Supplements": {
            "ontology_id": "FOODON_00001874",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "T. high": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Tahini": {
            "ontology_id": "FOODON_03304154",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Tender loin": {
            "ontology_id": "FOODON_03530217",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Tenderloin": {
            "ontology_id": "FOODON_03530217",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Thigh": {
            "ontology_id": "UBERON_0000376",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Thigh Skinless": {
            "ontology_id": "UBERON_0000376",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Thigh Skinless Boneless": {
            "ontology_id": "UBERON_0000376",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Thigh with Skin": {
            "ontology_id": "UBERON_0000014",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Trim": {
            "ontology_id": "FOODON_00001568",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Unknown Meal": {
            "ontology_id": "FOODON_03316468",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Unspecified Feed/Ingredient": {
            "ontology_id": "FOODON_03309997",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Upper Thigh": {
            "ontology_id": "UBERON_0000376",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Upper Thigh with Skin": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "upper thight": {
            "ontology_id": "UBERON_0000376",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Upperthigh": {
            "ontology_id": "UBERON_0000376",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "White Pepper": {
            "ontology_id": "FOODON_03304045",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Whole": {
            "ontology_id": "FOODON_03430131",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Whole Carcass": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Whole with Skin": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Wing": {
            "ontology_id": "UBERON_0000023",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Wings": {
            "ontology_id": "UBERON_0000023",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          }
        }
      },
      {
        "fieldName": "SUBMITTINGORG_1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "exportField": {
          "GRDI": [
            {
              "field": "collected_by"
            }
          ]
        }
      },
      {
        "fieldName": "SUBMITTINGLAB_1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "exportField": {
          "GRDI": [
            {
              "field": "laboratory_name"
            }
          ]
        }
      },
      {
        "fieldName": "PROJECT_1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "COUNTRY_1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "exportField": {
          "GRDI": [
            {
              "field": "geo_loc_name (country)"
            }
          ]
        }
      },
      {
        "fieldName": "PROVINCE_1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "exportField": {
          "GRDI": [
            {
              "field": "geo_loc_name (state/province/region)"
            }
          ]
        }
      },
      {
        "fieldName": "CENSUSDIVISION_1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "REGION",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "YEAR",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "MONTH",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "QTR",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "DATECOLLECTED_1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "exportField": {
          "GRDI": [
            {
              "field": "sample_collection_date"
            }
          ]
        }
      },
      {
        "fieldName": "DATERECEIVED_1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "DATESHIPPED_1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "ESTABLISHMENT_1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "SPECIES",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "exportField": {
          "GRDI": [
            {
              "field": "host (common name)"
            }
          ]
        },
        "schema:ItemList": {
          "2": {},
          "4": {},
          "<=8": {},
          "<n/a>": {},
          "Abalone": {
            "ontology_id": "FOODON_03411408"
          },
          "Alfalfa sprouts": {
            "ontology_id": "FOODON_00002670"
          },
          "Alpaca": {
            "ontology_id": "FOODON_00002693"
          },
          "Amphibian": {
            "ontology_id": "FOODON_03411624"
          },
          "Apple": {
            "ontology_id": "FOODON_00002473"
          },
          "Aquatic mammal": {
            "ontology_id": "FOODON_03411134"
          },
          "Armadillo": {
            "ontology_id": "FOODON_03411626"
          },
          "Avian": {
            "ontology_id": "FOODON_00002616"
          },
          "Basil": {
            "ontology_id": "FOODON_00003044"
          },
          "Bat": {
            "ontology_id": "CURATION_0001601"
          },
          "Bear": {
            "ontology_id": "FOODON_03412406"
          },
          "Bearded Dragon": {
            "ontology_id": "NCBITAXON_103695"
          },
          "Bison": {
            "ontology_id": "FOODON_03412098"
          },
          "Budgie": {},
          "Camel": {
            "ontology_id": "FOODON_03412103"
          },
          "Camelid": {
            "ontology_id": "FOODON_03412103"
          },
          "Canary": {},
          "Canine": {
            "ontology_id": "FOODON_03414847"
          },
          "Cantelope": {
            "ontology_id": "CURATION_0001383"
          },
          "Caprine": {
            "ontology_id": "FOODON_03411328"
          },
          "Cardemom": {},
          "Cardinal": {},
          "Cervid": {
            "ontology_id": "FOODON_03411500"
          },
          "Chameleon": {
            "ontology_id": "CURATION_0001646"
          },
          "Cheetah": {},
          "Chicken": {
            "ontology_id": "FOODON_03411457"
          },
          "Chimpanzee": {},
          "Chinchilla": {},
          "Chinese Water Dragon": {},
          "Clam": {
            "ontology_id": "FOODON_03411331"
          },
          "Coriander": {
            "ontology_id": "FOODON_00001763"
          },
          "Cormorant": {},
          "Cougar/Mountain Lion": {},
          "Coyote": {
            "ontology_id": "CURATION_0001607"
          },
          "Crab": {
            "ontology_id": "FOODON_03411335"
          },
          "Crane": {},
          "Crow": {},
          "Cumin seeds": {
            "ontology_id": "FOODON_00003024"
          },
          "Cuttlefish": {
            "ontology_id": "FOODON_03411644"
          },
          "Dog": {
            "ontology_id": "FOODON_03414847"
          },
          "Dolphin": {
            "ontology_id": "FOODON_03413363"
          },
          "Domestic Cat": {
            "ontology_id": "NCIT_C14191"
          },
          "Domestic Cattle": {
            "ontology_id": "FOODON_03411161"
          },
          "Duck": {
            "ontology_id": "FOODON_03411316"
          },
          "Dumpster": {},
          "Eagle": {},
          "Eel": {
            "ontology_id": "FOODON_03411278"
          },
          "Elephant": {
            "ontology_id": "FOODON_03412129"
          },
          "Falcon": {},
          "Feline": {
            "ontology_id": "NCIT_C14191"
          },
          "Ferret": {
            "ontology_id": "CURATION_0001411"
          },
          "Finch": {},
          "Fish": {
            "ontology_id": "FOODON_03411222"
          },
          "Flamingo": {},
          "For Unspecified": {},
          "Fox": {
            "ontology_id": "CURATION_0001405"
          },
          "Gecko": {
            "ontology_id": "FOODON_03412615"
          },
          "Goat": {
            "ontology_id": "FOODON_03411328"
          },
          "Goat and Sheep": {},
          "Goose": {
            "ontology_id": "FOODON_03411253"
          },
          "Grape": {
            "ontology_id": "FOODON_03301123"
          },
          "Green onions": {
            "ontology_id": "FOODON_03411478"
          },
          "Grosbeak": {},
          "ground pepper": {
            "ontology_id": "FOODON_03301526"
          },
          "Gull": {
            "ontology_id": "FOODON_03413503"
          },
          "Hare": {
            "ontology_id": "FOODON_03412695"
          },
          "Hazelnut": {
            "ontology_id": "FOODON_00002933"
          },
          "Hedgehog": {
            "ontology_id": "FOODON_03414548"
          },
          "Herb/spice (unspecified)": {},
          "Heron": {
            "ontology_id": "FOODON_00002890"
          },
          "Hippopotamidae": {
            "ontology_id": "NCBITAXON_9831"
          },
          "Horse": {
            "ontology_id": "FOODON_03411229"
          },
          "Iguana": {
            "ontology_id": "FOODON_03412701"
          },
          "Jaguar": {},
          "Kangaroo": {
            "ontology_id": "FOODON_03412092"
          },
          "Komodo Dragon": {},
          "Lapine": {},
          "Lettuce": {
            "ontology_id": "FOODON_00001998"
          },
          "Lion": {},
          "Lizard": {
            "ontology_id": "FOODON_03412293"
          },
          "Marsupial": {},
          "Mink": {
            "ontology_id": "FOODON_00002723"
          },
          "Mint": {
            "ontology_id": "FOODON_00002432"
          },
          "Mixed": {},
          "Mongoose": {},
          "Mouse": {
            "ontology_id": "NCIT_C14238"
          },
          "Mushrooms": {
            "ontology_id": "FOODON_00001287"
          },
          "Mussel": {
            "ontology_id": "FOODON_03411223"
          },
          "n/a": {},
          "Not Available": {},
          "Octopus": {
            "ontology_id": "FOODON_03411514"
          },
          "Opossum": {
            "ontology_id": "FOODON_03411450"
          },
          "Oregano": {
            "ontology_id": "FOODON_03301482"
          },
          "Other": {},
          "Otter": {
            "ontology_id": "CURATION_0001394"
          },
          "Ovine": {
            "ontology_id": "FOODON_03411183"
          },
          "Owl": {
            "ontology_id": "NCBITAXON_30458"
          },
          "Oyster": {
            "ontology_id": "FOODON_03411224"
          },
          "Parrot": {
            "ontology_id": "FOODON_00002726"
          },
          "Parsley": {
            "ontology_id": "FOODON_00002942"
          },
          "Partridge": {
            "ontology_id": "FOODON_03411382"
          },
          "Pea sprouts": {},
          "Peanut Butter": {
            "ontology_id": "FOODON_03306867"
          },
          "Pepper": {
            "ontology_id": "FOODON_00001649"
          },
          "Perdrix": {
            "ontology_id": "FOODON_03411382"
          },
          "Pheasant": {
            "ontology_id": "FOODON_03411460"
          },
          "Pickerel": {},
          "Pig": {
            "ontology_id": "FOODON_03411136"
          },
          "Pigeon": {
            "ontology_id": "FOODON_03411304"
          },
          "Pine Siskin": {
            "ontology_id": "CURATION_0000439"
          },
          "Pony": {},
          "Porcupine": {},
          "Porpoise": {
            "ontology_id": "FOODON_03413364"
          },
          "Primate": {
            "ontology_id": "NCBITAXON_9443"
          },
          "Quail": {
            "ontology_id": "FOODON_03411346"
          },
          "Rabbit": {
            "ontology_id": "FOODON_03411323"
          },
          "Raccoon": {
            "ontology_id": "FOODON_03411461"
          },
          "Rat": {
            "ontology_id": "FOODON_03414848"
          },
          "Ratite": {
            "ontology_id": "FOODON_03414362"
          },
          "Raven": {},
          "Red Deer": {
            "ontology_id": "FOODON_03414371"
          },
          "Redpoll": {},
          "Reptile": {
            "ontology_id": "FOODON_03411625"
          },
          "Rhea": {
            "ontology_id": "FOODON_03414556"
          },
          "Robin": {},
          "Rodent": {
            "ontology_id": "NCBITAXON_9989"
          },
          "Sage": {
            "ontology_id": "FOODON_00002217"
          },
          "Salmon": {
            "ontology_id": "FOODON_00002220"
          },
          "Scallop": {
            "ontology_id": "FOODON_03411489"
          },
          "Sea Otter": {
            "ontology_id": "CURATION_0000157"
          },
          "Sea Snail": {
            "ontology_id": "FOODON_03414639"
          },
          "Seal": {},
          "Sesame Seed": {
            "ontology_id": "FOODON_03310306"
          },
          "Sheep": {
            "ontology_id": "FOODON_03411183"
          },
          "Shrimp": {
            "ontology_id": "FOODON_03411237"
          },
          "Skink": {
            "ontology_id": "FOODON_03412293"
          },
          "Skunk": {},
          "Snake": {
            "ontology_id": "FOODON_03411295"
          },
          "Sparrow": {},
          "Spinach": {
            "ontology_id": "FOODON_03301716"
          },
          "Spotted Hyena": {},
          "Sprouts": {
            "ontology_id": "FOODON_03420183"
          },
          "Squid": {
            "ontology_id": "FOODON_03411205"
          },
          "Squirrel": {
            "ontology_id": "FOODON_03411389"
          },
          "Stripped Hyena": {},
          "Swan": {},
          "Tantalus Monkey": {
            "ontology_id": "FOODON_03412439"
          },
          "Tilapia": {
            "ontology_id": "FOODON_03412434"
          },
          "Tomato": {
            "ontology_id": "FOODON_03309927"
          },
          "Tortoise": {
            "ontology_id": "FOODON_00000074"
          },
          "Trout": {
            "ontology_id": "FOODON_03411258"
          },
          "Turkey": {
            "ontology_id": "FOODON_03414166"
          },
          "Turtle": {
            "ontology_id": "FOODON_03411242"
          },
          "Unknown": {},
          "Unspecified Bird": {
            "ontology_id": "FOODON_00002616"
          },
          "Unspecified Fish": {
            "ontology_id": "FOODON_03411222"
          },
          "Unspecified Primate": {
            "ontology_id": "NCBITAXON_9443"
          },
          "Unspecified Reptile": {
            "ontology_id": "FOODON_03411625"
          },
          "Unspecified Rodent": {
            "ontology_id": "NCBITAXON_9989"
          },
          "Vulture": {},
          "Wallnut": {},
          "Water Dragon": {
            "ontology_id": "CHEBI_15377"
          },
          "White Fish": {
            "ontology_id": "FOODON_00003281"
          },
          "Wild Ruminant": {
            "ontology_id": "FOODON_03530153"
          },
          "Wombat": {},
          "Woodpecker": {},
          "Zebra": {
            "ontology_id": "FOODON_03412097"
          }
        }
      },
      {
        "fieldName": "STTYPE",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "schema:ItemList": {
          "0": {},
          "0.5": {},
          "ANIMAL": {
            "ontology_id": "FOODON_00003004",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "ENVIRONMENT": {
            "ontology_id": "ENVO_01000254",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                },
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "FOOD": {
            "ontology_id": "CHEBI_33290",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "HUMAN": {
            "ontology_id": "NCBITAXON_9606",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "PRODUCT": {},
          "QA": {},
          "UNKNOWN": {
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          }
        }
      },
      {
        "fieldName": "STYPE",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "schema:ItemList": {
          "0": {},
          "2": {},
          "<=8": {},
          "<n/a>": {},
          "Amphibian": {
            "ontology_id": "FOODON_03411624",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Aquatic Mammal": {
            "ontology_id": "FOODON_03411134",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Armadillo": {
            "ontology_id": "FOODON_03411626",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Avian": {
            "ontology_id": "FOODON_00002616",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Bat": {
            "ontology_id": "CURATION_0001601",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Biosolids": {
            "ontology_id": "ENVO_00002059",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Bovine": {
            "ontology_id": "FOODON_03414374",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Building": {
            "ontology_id": "ENVO_00000073",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Camelid": {
            "ontology_id": "FOODON_03412103",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Canine": {
            "ontology_id": "FOODON_03414847",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Caprine": {
            "ontology_id": "FOODON_03411328",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Caprine and Ovine": {
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Cereal": {
            "ontology_id": "FOODON_00001709",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Cereal/Bread/Snack": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Cervid": {
            "ontology_id": "FOODON_03411500",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Compost": {
            "ontology_id": "CURATION_0001527",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Confections/Nuts/Condiments": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Crocuta": {
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Crustacean": {
            "ontology_id": "FOODON_03411374",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Dairy": {
            "ontology_id": "ENVO_00003862",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Dust": {
            "ontology_id": "ENVO_00002008",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Egg": {
            "ontology_id": "FOODON_00001274",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Elephant": {
            "ontology_id": "FOODON_03412129",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Equine": {
            "ontology_id": "CURATION_0001431",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Equipment": {
            "ontology_id": "CURATION_0000348",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "ERROR": {},
          "Feed and Ingredients": {
            "ontology_id": "FOODON_03309997",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Feline": {
            "ontology_id": "NCIT_C14191",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Ferret": {
            "ontology_id": "CURATION_0001411",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Fertilizer": {
            "ontology_id": "CHEBI_33287",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Fish": {
            "ontology_id": "FOODON_03411222",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Food": {
            "ontology_id": "CHEBI_33290",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Fruit": {
            "ontology_id": "PO_0009001",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Fruits and Vegetables": {
            "ontology_id": "FOODON_00002141",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Health (medicine)": {},
          "Herbs and Spices": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Herpestidae": {
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Hippopotamidae": {
            "ontology_id": "NCBITAXON_9831",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Lapine": {
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Litter/Manure": {
            "ontology_id": "CURATION_0001446",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Manure": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Marsupial": {
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Meat": {
            "ontology_id": "FOODON_00001006",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Mephitida": {
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Mink": {
            "ontology_id": "FOODON_00002723",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Mixed food": {
            "ontology_id": "CHEBI_33290",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Mixed Food/Meat": {
            "ontology_id": "FOODON_03315600",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Mollusk": {
            "ontology_id": "FOODON_03412112",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Mustelid": {
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "n/a": {
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Other": {
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Ovine": {
            "ontology_id": "FOODON_03411183",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Personnel Clothing": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Porcine": {
            "ontology_id": "FOODON_03411136",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Primate": {
            "ontology_id": "NCBITAXON_9443",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Raccoon": {
            "ontology_id": "FOODON_03411461",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Reptile": {
            "ontology_id": "FOODON_03411625",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Rodent": {
            "ontology_id": "NCBITAXON_9989",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Sewage": {
            "ontology_id": "ENVO_00002018",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Soil": {
            "ontology_id": "ENVO_00001998",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Transportation Supplies": {
            "ontology_id": "ENVO_02000125",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Transportation Vehicles": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Turkey": {
            "ontology_id": "FOODON_03414166",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Unknown": {
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Unknown Food": {
            "ontology_id": "CHEBI_33290",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Unspecified": {},
          "Unspecified Animal": {
            "ontology_id": "FOODON_00003004",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Unspecified Environmental": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Unspecified Food": {
            "ontology_id": "CURATION_0001610",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Unspecified Product": {
            "ontology_id": "CHEBI_33290"
          },
          "Ursine": {
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Vegetable/Spice": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Water": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          }
        }
      },
      {
        "fieldName": "COMMODITY",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "schema:ItemList": {
          "<=16": {
            "ontology_id": "CHEBI_15377"
          },
          "Beef": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Broiler": {
            "ontology_id": "FOODON_00001041",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Dairy": {
            "ontology_id": "FOODON_03411198",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Domestic/Farmed": {
            "ontology_id": "ENVO_00003862"
          },
          "Egg": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Laboratory": {
            "ontology_id": "FOODON_00001274",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Meat": {
            "ontology_id": "NCIT_C37984",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Mutton": {
            "ontology_id": "FOODON_00001006",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Pet": {
            "ontology_id": "FOODON_00002912",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Pet/Zoo": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Red Veal": {
            "ontology_id": "ENVO_00010625",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Unknown": {
            "ontology_id": "FOODON_00003083",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Veal": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "White Veal": {
            "ontology_id": "FOODON_00003083",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Wild": {
            "ontology_id": "FOODON_00003083"
          }
        }
      },
      {
        "fieldName": "SPECIMENSOURCE_1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "schema:ItemList": {
          "2": {
            "ontology_id": "FOODON_03530153"
          },
          "<=32": {},
          "Aliquote / Portion": {},
          "Blood": {
            "ontology_id": "CURATION_0000508",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_material"
                }
              ]
            }
          },
          "Blood Meal": {
            "ontology_id": "UBERON_0000178",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Body Fluid/Excretion": {
            "ontology_id": "FOODON_00001564",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_material"
                }
              ]
            }
          },
          "Carcass": {
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Check Sample": {
            "ontology_id": "UBERON_0008979"
          },
          "Contact plate": {
            "ontology_id": "SEP_00042",
            "exportField": {
              "GRDI": [
                {
                  "field": "collection_device"
                }
              ]
            }
          },
          "Culture": {},
          "Dust": {
            "ontology_id": "CURATION_0000488",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Egg": {
            "ontology_id": "ENVO_00002008",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Environment (Animal)": {
            "ontology_id": "FOODON_00001274"
          },
          "Environmental": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                },
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Feces": {
            "ontology_id": "CURATION_0001610",
            "exportField": {
              "GRDI": [
                {
                  "field": "body_product"
                }
              ]
            }
          },
          "Fetus/Embryo": {
            "ontology_id": "UBERON_0001988",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Organ": {
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Organ/Tissue": {
            "ontology_id": "UBERON_0000062",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_material"
                }
              ]
            }
          },
          "Proficiency Isolate": {},
          "Reference Culture": {
            "ontology_id": "NCIT_C53471"
          },
          "Rinse": {
            "ontology_id": "CURATION_0000488",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Septage": {
            "ontology_id": "CURATION_0001629",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Soya Meal": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Stool": {
            "ontology_id": "FOODON_03316468",
            "exportField": {
              "GRDI": [
                {
                  "field": "body_product"
                }
              ]
            }
          },
          "Swab": {
            "ontology_id": "UBERON_0001988",
            "exportField": {
              "GRDI": [
                {
                  "field": "collection_device"
                }
              ]
            }
          },
          "Tissue": {
            "ontology_id": "NCIT_C17627",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_material"
                }
              ]
            }
          },
          "Unit (Pre-Packaged)": {
            "ontology_id": "UBERON_0000479"
          },
          "Unknown": {
            "ontology_id": "UO_0000000",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Unspecified": {},
          "Urine": {
            "exportField": {
              "GRDI": [
                {
                  "field": "body_product"
                }
              ]
            }
          }
        }
      },
      {
        "fieldName": "SPECIMENSUBSOURCE_1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "schema:ItemList": {
          "0.25": {
            "ontology_id": "UBERON_0001088"
          },
          "<=0.12": {},
          "<=16": {},
          "aansarraysubsource": {},
          "Abdomen": {
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Abdominal Muscle": {
            "ontology_id": "UBERON_0000916",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Abomasum": {
            "ontology_id": "UBERON_0002378",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Abscess": {
            "ontology_id": "UBERON_0007358",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_material"
                }
              ]
            }
          },
          "Air Intake": {
            "ontology_id": "HP_0025615",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Air Sac": {
            "ontology_id": "ENVO_00002005",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Anal Gland": {
            "ontology_id": "UBERON_0009060",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Animal Pen": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Balut": {
            "ontology_id": "FOODON_00003004",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Belt": {
            "ontology_id": "FOODON_03302184",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Bladder": {
            "ontology_id": "CURATION_0000406",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Blood": {
            "ontology_id": "CURATION_0000504",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_material"
                }
              ]
            }
          },
          "Blood vessel": {
            "ontology_id": "UBERON_0000178",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Bone": {
            "ontology_id": "UBERON_0001981",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_material"
                }
              ]
            }
          },
          "Bone Marrow": {
            "ontology_id": "UBERON_0001474",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_material"
                }
              ]
            }
          },
          "Bootie": {
            "ontology_id": "UBERON_0002371",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Boots": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Brain": {
            "ontology_id": "CURATION_0000401",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Bursa of Fabricus": {
            "ontology_id": "UBERON_0000955",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Cages": {
            "ontology_id": "CURATION_0000502",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Cavity Fluid (Unspecified)": {
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_material"
                }
              ]
            }
          },
          "Cavity fluid unspecified": {
            "ontology_id": "CURATION_0000480",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_material"
                }
              ]
            }
          },
          "Cecal Content": {
            "ontology_id": "CURATION_0000480",
            "exportField": {
              "GRDI": [
                {
                  "field": "body_product"
                }
              ]
            }
          },
          "Cecum": {
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Chick Boxes": {
            "ontology_id": "CURATION_0000495",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Chick Pads": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Cloacae": {
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Cloacal swab": {
            "ontology_id": "CURATION_0000491",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Colon": {
            "ontology_id": "NCIT_C17627",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Confirmation": {
            "ontology_id": "UBERON_0001155",
            "exportField": {
              "GRDI": [
                {
                  "value": "?"
                }
              ]
            }
          },
          "Crates": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Crop": {
            "ontology_id": "FOODON_03490213",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Culture Plate": {
            "ontology_id": "UBERON_0007356",
            "exportField": {
              "GRDI": [
                {
                  "field": "collection_device"
                }
              ]
            }
          },
          "Digestive System (Unspecified)": {
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Duodenum": {
            "ontology_id": "UBERON_0001007",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Dust": {
            "ontology_id": "UBERON_0002114",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Ear": {
            "ontology_id": "ENVO_00002008",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Egg Belt": {
            "ontology_id": "UBERON_0001690",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Environment Swab": {
            "exportField": {
              "GRDI": [
                {
                  "field": "collection_device"
                }
              ]
            }
          },
          "Environment Swab (Hatchery)": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site",
                  "value": "hatchery"
                },
                {
                  "field": "collection_device",
                  "value": "swab"
                }
              ]
            }
          },
          "Esophagus": {
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "External Quality Assurance": {
            "ontology_id": "UBERON_0001043",
            "exportField": {
              "GRDI": [
                {
                  "value": "?"
                }
              ]
            }
          },
          "Eye": {
            "ontology_id": "BFO_0000019",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Fan": {
            "ontology_id": "UBERON_0000970",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Fecal Slurry": {
            "ontology_id": "ENVO_00000104",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Feces": {
            "ontology_id": "UBERON_0001988",
            "exportField": {
              "GRDI": [
                {
                  "field": "body_product"
                }
              ]
            }
          },
          "Feed": {
            "ontology_id": "UBERON_0001988",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Feeders and Drinkers": {
            "ontology_id": "FOODON_03309997",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Fetal Tissue": {
            "ontology_id": "CURATION_0000419",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_material"
                }
              ]
            }
          },
          "Final Wash": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Floor": {
            "ontology_id": "CURATION_0001488",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Fluff": {
            "ontology_id": "CURATION_0000335",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Fluff (Hatchery)": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Foot": {
            "ontology_id": "ENVO_01001873",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Gall Bladder": {
            "ontology_id": "UO_0010013",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Gallbladder": {
            "ontology_id": "UBERON_0002110",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Ganglion": {
            "ontology_id": "UBERON_0002110",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Gizzard": {
            "ontology_id": "UBERON_0000045",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Growth / lesion (unspecified tissue)": {
            "ontology_id": "UBERON_0005052",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_material"
                }
              ]
            }
          },
          "Growth/Lesion (Unspecified Tissue)": {
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_material"
                }
              ]
            }
          },
          "Heart": {
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Ileum": {
            "ontology_id": "UBERON_0000948",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "In-House": {
            "ontology_id": "UBERON_0002116"
          },
          "Inter-Lab Exchange": {
            "ontology_id": "ENVO_01000417"
          },
          "Intestinal Contents": {
            "ontology_id": "NCIT_C37984",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_material"
                }
              ]
            }
          },
          "Intestine": {
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Jejunum": {
            "ontology_id": "UBERON_0000160",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Joint": {
            "ontology_id": "UBERON_0002115",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Joint Fluid": {
            "ontology_id": "UBERON_0004905",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_material"
                }
              ]
            }
          },
          "Kidney": {
            "ontology_id": "UBERON_0001090",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Levage/peritoneal": {
            "ontology_id": "UBERON_0002113",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_material"
                }
              ]
            }
          },
          "Levage/Tracheal": {
            "ontology_id": "CURATION_0000463",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_material"
                }
              ]
            }
          },
          "Litter": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Litter/Manure": {
            "ontology_id": "CURATION_0001446",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Live Haul Truck": {
            "ontology_id": "CURATION_0001446",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Live Haul Truck/Trailer": {
            "ontology_id": "ENVO_01000602",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Liver": {
            "ontology_id": "ENVO_01000602",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Lung": {
            "ontology_id": "UBERON_0002107",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Lymph Node": {
            "ontology_id": "UBERON_0002048",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Manure Pit": {
            "ontology_id": "UBERON_0000029",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Meconium": {
            "ontology_id": "ENVO_01001872",
            "exportField": {
              "GRDI": [
                {
                  "field": "body_product"
                }
              ]
            }
          },
          "Mesenteric Lymph Node": {
            "ontology_id": "UBERON_0007109",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Milk/Colostrum": {
            "ontology_id": "UBERON_0002509",
            "exportField": {
              "GRDI": [
                {
                  "field": "body_product"
                }
              ]
            }
          },
          "Mixed": {
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Mixed Organs": {
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Mixed Tissues": {
            "ontology_id": "UBERON_0000062",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_material"
                }
              ]
            }
          },
          "Mouth": {
            "ontology_id": "UBERON_0000479",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Mucous membrane (gut)": {
            "ontology_id": "UBERON_0000165",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Mucous membrane (resp)": {
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Mucus": {
            "ontology_id": "UBERON_0000344",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_material"
                }
              ]
            }
          },
          "Muscle": {
            "ontology_id": "UBERON_0000912",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Muscle/Meat": {
            "ontology_id": "CURATION_0001428",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Nasal Turbinate": {
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Nasal/Naries": {
            "ontology_id": "UBERON_0035612",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Organ Unspecified": {
            "ontology_id": "CURATION_0000466",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Ovary": {
            "ontology_id": "UBERON_0000062",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Oviduct": {
            "ontology_id": "UBERON_0000992",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Pericardium": {
            "ontology_id": "UBERON_0000993",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Peritoneal Fluid": {
            "ontology_id": "UBERON_0002407",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_material"
                }
              ]
            }
          },
          "Peritoneum": {
            "ontology_id": "UBERON_0001268",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Placenta": {
            "ontology_id": "UBERON_0002358",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Pleura": {
            "ontology_id": "UBERON_0001987",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Plucking Belt": {
            "ontology_id": "UBERON_0000977",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Plucking Water": {
            "ontology_id": "CURATION_0000406",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Pooled Feces": {
            "ontology_id": "CHEBI_15377",
            "exportField": {
              "GRDI": [
                {
                  "field": "body_product"
                }
              ]
            }
          },
          "Rectal Swab": {
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Rectum": {
            "ontology_id": "CURATION_0000457",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Research": {
            "ontology_id": "UBERON_0001052"
          },
          "Rinse": {
            "ontology_id": "CURATION_0001536",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Rumen": {
            "ontology_id": "CURATION_0001629",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Shell": {
            "ontology_id": "UBERON_0007365",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_material"
                }
              ]
            }
          },
          "Shell egg": {
            "ontology_id": "UBERON_0006612",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Sinus": {
            "ontology_id": "UBERON_0005079",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Skin": {
            "ontology_id": "CURATION_0000455",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Small Intestine": {
            "ontology_id": "UBERON_0000014",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Soil": {
            "ontology_id": "UBERON_0002108",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Spinal Cord": {
            "ontology_id": "ENVO_00001998",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Spleen": {
            "ontology_id": "UBERON_0002240",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Stall": {
            "ontology_id": "UBERON_0002106",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Stomach": {
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Stomach Contents": {
            "ontology_id": "UBERON_0000945",
            "exportField": {
              "GRDI": [
                {
                  "field": "body_product"
                }
              ]
            }
          },
          "Swab": {
            "exportField": {
              "GRDI": [
                {
                  "field": "collection_device"
                }
              ]
            }
          },
          "Swab (Nasal)": {
            "ontology_id": "NCIT_C17627",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Swab (Rectal)": {
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Swab (Tissue Fluid-Unspecified)": {
            "ontology_id": "CURATION_0000457",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_material"
                }
              ]
            }
          },
          "Testicle": {
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Thorax": {
            "ontology_id": "UBERON_0000473",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Trachea": {
            "ontology_id": "UBERON_0000915",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Unknown organ": {
            "ontology_id": "UBERON_0003126",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Unspecified Organ/Tissue": {
            "ontology_id": "UBERON_0000062",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Urine": {
            "exportField": {
              "GRDI": [
                {
                  "field": "body_product"
                }
              ]
            }
          },
          "Uterus": {
            "ontology_id": "UBERON_0001088",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Vagina": {
            "ontology_id": "UBERON_0000995",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Walls": {
            "ontology_id": "UBERON_0000996",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Water": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Watering Bowl/Equipment": {
            "ontology_id": "CHEBI_15377",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Weekly": {},
          "Weep": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Whole": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Yolk": {
            "ontology_id": "FOODON_03430131",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Yolk Sac": {
            "ontology_id": "UBERON_2000084",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          }
        }
      },
      {
        "fieldName": "SUBJECT_SUBTYPE",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "schema:ItemList": {
          "<=32": {
            "ontology_id": "UBERON_0001040"
          },
          "<n/a>": {},
          ">32": {},
          "Alfalfa Sprouts": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Almond": {
            "ontology_id": "FOODON_00002670",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Animal pen": {
            "ontology_id": "FOODON_03301355",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Artificial wetland": {
            "ontology_id": "FOODON_00003004",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Arugula": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Basil": {
            "ontology_id": "FOODON_00002426",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Bean Sprouts": {
            "ontology_id": "FOODON_00003044",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Biosolid": {
            "ontology_id": "FOODON_00002576",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Biosolid/Sludge": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Bootie": {
            "ontology_id": "ENVO_00002044",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Boots": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Breast": {
            "ontology_id": "CURATION_0000401",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Breast skinless": {
            "ontology_id": "UBERON_0000310",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Breast skinless boneless": {
            "ontology_id": "UBERON_0000310",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Breast with skin": {
            "ontology_id": "UBERON_0000310",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Broom": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Bulk Tank": {
            "ontology_id": "CURATION_0000397",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Cantaloupe": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Carcass (whole)": {
            "ontology_id": "CURATION_0001383",
            "exportField": {
              "GRDI": [
                {
                  "field": "anatomical_part"
                }
              ]
            }
          },
          "Cheese": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Chia Powder": {
            "ontology_id": "FOODON_00001013",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Chia Seeds": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Chia Sprouts": {
            "ontology_id": "CURATION_0001385",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Chick Boxes": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Chick Pads": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Chickpea": {
            "ontology_id": "UBERON_2001977",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Chili": {
            "ontology_id": "FOODON_03306811",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Chilli Pepper": {
            "ontology_id": "FOODON_03301511",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Chives": {
            "ontology_id": "FOODON_03315873",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Chops": {
            "ontology_id": "FOODON_03311167",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Coconut": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Compost": {
            "ontology_id": "FOODON_03303085",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Cooler Line": {
            "ontology_id": "CURATION_0001527",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Coriander Seeds": {
            "ontology_id": "SIO_000511",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Coriander-Cumin Powder": {
            "ontology_id": "PO_0009010",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Cottage": {
            "ontology_id": "FOODON_00002976",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Cucumber": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Curry Leaves": {
            "ontology_id": "FOODON_03301545",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Curry powder": {
            "ontology_id": "FOODON_03306648",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Cut": {
            "ontology_id": "FOODON_03301842",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Dead Haul Truck / Trailer": {
            "ontology_id": "ENVO_00000474",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Dill": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Drumstick": {
            "ontology_id": "FOODON_00001811",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Dumpster": {
            "ontology_id": "CURATION_0001378",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Effluent": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Egg": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Egg Belt": {
            "ontology_id": "FOODON_00001274",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Fan": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Feed Pans": {
            "ontology_id": "ENVO_00000104",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Fennel": {
            "ontology_id": "FOODON_03309997",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Filet": {
            "ontology_id": "FOODON_03309953",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Flax and Chia Powder": {
            "ontology_id": "FOODON_03530144",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Flax Powder": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Floor": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "For Avian": {
            "ontology_id": "CURATION_0000335",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "For Beef Cattle": {
            "ontology_id": "FOODON_00002616",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "For Cats": {
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "For Cattle (Beef)": {
            "ontology_id": "CURATION_0001354",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "For Cattle (Dairy)": {
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "For Chicken": {
            "ontology_id": "FOODON_00002505",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "For Dairy Cows": {
            "ontology_id": "FOODON_03411457",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "For Dogs": {
            "ontology_id": "FOODON_03411201",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "For Fish": {
            "ontology_id": "CURATION_0001351",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "For Goats": {
            "ontology_id": "FOODON_03411222",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "For Horse": {
            "ontology_id": "FOODON_03411328",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "For Mink": {
            "ontology_id": "FOODON_03411229",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "For Others": {
            "ontology_id": "FOODON_00002723"
          },
          "For Poultry": {
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "For Swine": {
            "ontology_id": "FOODON_00001131",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "For Turkeys": {
            "ontology_id": "FOODON_03411136",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "For Unknown": {
            "ontology_id": "FOODON_03414166"
          },
          "For Unspecified": {
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Garlic Powder": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ginger": {
            "ontology_id": "FOODON_03301844",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Green Onion": {
            "ontology_id": "FOODON_00002718",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ground": {
            "ontology_id": "FOODON_03411478",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ground (extra lean)": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ground (lean)": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ground (medium)": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ground (regular)": {
            "ontology_id": "FOODON_03430117",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Ground Water": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Ham": {
            "ontology_id": "ENVO_00002041",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Hazelnut / Filbert": {
            "ontology_id": "FOODON_00002502",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Headcheese": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Herb/Spice (Unspecified)": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Irrigation": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Kale": {
            "ontology_id": "CURATION_0000309",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Kalonji Whole Seed": {
            "ontology_id": "FOODON_03304859",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Lab Surface": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Lake": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Leg": {
            "ontology_id": "ENVO_00000020",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Lettuce": {
            "ontology_id": "UBERON_0000978",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Liquid whole": {
            "ontology_id": "FOODON_00001998",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Liver": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Loin center chop non-seasoned": {
            "ontology_id": "UBERON_0002107",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Mango": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Meat": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Milk": {
            "ontology_id": "FOODON_00001006",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Mint": {
            "ontology_id": "UBERON_0001913",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Mixed": {
            "ontology_id": "FOODON_00002432",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Mixed Salad/Mixed Greens": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Mixed Sprouts": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Mung Bean Sprouts": {
            "ontology_id": "FOODON_03420183",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Oregano": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Other": {
            "ontology_id": "FOODON_03301482",
            "exportField": {
              "GRDI": [
                {
                  "field": "host (common name)"
                }
              ]
            }
          },
          "Other chicken": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Other cut (not ground)": {
            "ontology_id": "FOODON_03411457",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Other variety meats": {
            "ontology_id": "ENVO_00000474",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Papaya": {
            "ontology_id": "FOODON_03420218",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Paprika": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Parsley": {
            "ontology_id": "FOODON_03301105",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Pea Sprouts": {
            "ontology_id": "FOODON_00002942",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Pepper": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Pepper Powder": {
            "ontology_id": "FOODON_00001649",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Pepperoni": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Rasam Powder Spice": {
            "ontology_id": "FOODON_03311003",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "River": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "River Surface": {
            "ontology_id": "ENVO_00000022",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Roast": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Rolled": {},
          "Run Off": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Sausage": {
            "ontology_id": "ENVO_00000029",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Scallopini": {
            "ontology_id": "FOODON_03315904",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Sediment": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Sesame Seed": {
            "ontology_id": "ENVO_00002007",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Shelf / Sill": {
            "ontology_id": "FOODON_03310306",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Shellfish": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Shoulder": {
            "ontology_id": "FOODON_03411433",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Shoulder Chop": {
            "ontology_id": "UBERON_0001467",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Shoulder chop non-seasoned": {
            "ontology_id": "UBERON_0001467",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Soft": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Soybean": {
            "ontology_id": "PATO_0000387",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Spinach": {
            "ontology_id": "FOODON_03301415",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Sprouted Seeds": {
            "ontology_id": "FOODON_03301716",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Sprouts": {
            "ontology_id": "FOODON_03420102",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Stall": {
            "ontology_id": "FOODON_03420183",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Steak": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Stew Chunks": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Surface - Other": {
            "ontology_id": "FOODON_00003140",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Surface - River": {
            "ontology_id": "CURATION_0000247",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Surface unspecified": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Surface Water": {
            "ontology_id": "CURATION_0000247",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Tenderloin": {
            "ontology_id": "ENVO_00002042",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Thigh": {
            "ontology_id": "FOODON_03530217",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Thigh with skin": {
            "ontology_id": "UBERON_0000376",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Transformer": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Truck / Trailer": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Truck/Trailer": {
            "ontology_id": "ENVO_01000602",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Turmeric": {
            "ontology_id": "ENVO_01000602",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Unknown": {
            "ontology_id": "FOODON_03310841"
          },
          "Unknown Surface": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Unspecified": {
            "ontology_id": "CURATION_0000247"
          },
          "Upper Thigh": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Upper Thigh with Skin": {
            "ontology_id": "UBERON_0000376",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Wall": {
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Walnut": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Waste Water": {
            "ontology_id": "FOODON_03315233",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_material"
                }
              ]
            }
          },
          "Watering bowl/equipment": {
            "ontology_id": "ENVO_00002001",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Whole": {
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Wings": {
            "ontology_id": "FOODON_03430131",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          },
          "Working Surface": {
            "ontology_id": "UBERON_0000023",
            "exportField": {
              "GRDI": [
                {
                  "field": "environmental_site"
                }
              ]
            }
          },
          "Yeast": {
            "ontology_id": "CURATION_0000247",
            "exportField": {
              "GRDI": [
                {
                  "field": "food_product"
                }
              ]
            }
          }
        }
      },
      {
        "fieldName": "FIELDSTAFF_1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "IN_STORE_PROCESSING",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "MAYCONTAINFROZENMEAT_1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "NOOFCASHREGISTERS_1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "PRICEPERKG_1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "STORETYPE_SAMPLINGSITE_1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "TEMPERATUREMAX_1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "TEMPERATUREMIN_1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "TEMPERATUREARRIVAL_1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "VETID",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "ROOMID",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "PENID",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "SAMPLING_TYPE",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "BARN_ID",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "DATE_PACKED",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "FINAL_ID_GENUS",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "exportField": {
          "GRDI": [
            {
              "field": "organism"
            }
          ]
        }
      },
      {
        "fieldName": "FINAL_ID_SPECIES",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "exportField": {
          "GRDI": [
            {
              "field": "organism"
            }
          ]
        }
      },
      {
        "fieldName": "FINAL_ID_SUBSPECIES",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "FINAL_ID_SEROTYPE",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "exportField": {
          "GRDI": [
            {
              "field": "serovar"
            }
          ]
        }
      },
      {
        "fieldName": "FINAL_ID_ANTIGEN",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "FINAL_ID_PHAGETYPE",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "exportField": {
          "GRDI": [
            {
              "field": "phagetype"
            }
          ]
        }
      },
      {
        "fieldName": "SA_Serotype_Method",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "exportField": {
          "GRDI": [
            {
              "field": "serotyping_method"
            }
          ]
        }
      },
      {
        "fieldName": "SEROTYPE_GR",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "MIC_AMC",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "MIC_AMK",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "MIC_AMP",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "MIC_AZM",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "MIC_CEP",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "MIC_CHL",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "MIC_CIP",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "MIC_CRO",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "MIC_FOX",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "MIC_GEN",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "MIC_KAN",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "MIC_MEM",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "MIC_NAL",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "MIC_SSS",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "MIC_STR",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "MIC_SXT",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "MIC_TET",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "MIC_TIO",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "N_OF_RESISTANCE",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "NBTESTED",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "R_PATTERN",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "AMR_PA2C",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RLEAST1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RLEAST2",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RLEAST3",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RLEAST4",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RLEAST5",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "SIR_AMC",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "SIR_AMK",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "SIR_AMP",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "SIR_AZM",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "SIR_CEP",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "SIR_CHL",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "SIR_CIP",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "SIR_CRO",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "SIR_FOX",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "SIR_GEN",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "SIR_KAN",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "SIR_MEM",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "SIR_NAL",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "SIR_SSS",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "SIR_STR",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "SIR_SXT",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "SIR_TET",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "SIR_TIO",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RAMC",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RAMK",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RAMP",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RAZM",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RCEP",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RCHL",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RCIP",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RCRO",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RFOX",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RGEN",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RKAN",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RMEM",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RNAL",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RSSS",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RSTR",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RSXT",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RTET",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RTIO",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "A2C",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "CAMC",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "CAMK",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "CAMP",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "CAZM",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "CCEP",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "CCHL",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "CCIP",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "CCRO",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "CFOX",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "CGEN",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "CKAN",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "CMEM",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "CNAL",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "CSSS",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "CSTR",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "CSXT",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "CTET",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "CTIO",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "STHY_TESTSRC_ID",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "WINN_TESTSRC_ID",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "GUEL_TESTSRC_ID",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RCIP_DANMAP",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "EPIDATESTAMP_1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "ACSSUT",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "AKSSUT",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "ACKSSUT",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "MDR_A_SSUT",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "EXCLUSION",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RAMINOGLY",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RBETALACTAM",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RQUINOLONES",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "RFOLINHIBITOR",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "MDR",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "specimen_number",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "EXTERNAL_AGENT",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "FARM_FLAG",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "AMIKACINGELET",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      }
    ]
  }
]