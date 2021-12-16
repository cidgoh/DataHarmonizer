# linkml-round-trips

This repo contains alpha-stage [LinkML](https://linkml.io/)-oriented tools, primarily in support of [BBOP](http://www.berkeleybop.org/index.html)-affiliated projects like the [National Microbiome Data Collaborative](https://microbiomedata.org/). As they mature, they will be migrated to other GitHUb organizastions, like https://github.com/microbiomedata

## Generally speaking:
### The tool are written in Python and managed with [Poetry](https://python-poetry.org/). 
Installation notes are avaialble for:
- [OSX, Linux, Bash on Windows](https://python-poetry.org/docs/#osx--linux--bashonwindows-install-instructions)
- [Windows Powershell](https://python-poetry.org/docs/#windows-powershell-install-instructions)

### User interfaces are buit with [Click](https://click.palletsprojects.com/)
In a local checkout of this repo, tools can be run with `poetry run <tool>`.

There are also [Makefile rules](Makefile) that illustrate the usage of command line parameters. These rules assume that the following GH repos have been cloned into  directories located in the same parent directory as this repo.


## Tasks

### Converting one or more machine-readalbe documents into a [DataHarmonizer](https://github.com/cidgoh/DataHarmonizer) interface
We use DataHarmonizer to build interfaces for gathering standards-based data, such as biosample metadata. For example, one NMDC biosample metadata iterface might combine the [`soil`](https://cmungall.github.io/mixs-source/Soil/#class-soil) package/class from [MiXS](https://github.com/cmungall/mixs-source) with the [`biosample`](https://microbiomedata.github.io/nmdc-schema/Biosample/#class-biosample) class from the [`nmdc-schema`](https://github.com/microbiomedata/nmdc-schema)

_Additional links for MIxS_:
- [_GSC MIxS home page_](https://gensc.org/mixs/)
- [_MIxS v5 and v6 specifications as Google Sheets_](https://docs.google.com/spreadsheets/d/1QDeeUcDqXes69Y2RjU2aWgOpCVWo5OVsBX9MKmMqi_o/edit#gid=178015749)

In other words, the LinkML slots describing the `soil` class and the `biosmaple` will appear as columns in one DataHarmonizer interface. The two classes might both define a class with a shared name, so the code in this repo must supoort resolving differences in how those shared slots are defined (with as much automation as possible).

Another requirement is supporting institution or project-specific DataHarmoinzer columns. The requirements of [EMSL](https://www.emsl.pnnl.gov/) are provided as the [Soil-NMDC-Template_Compile Google Sheet](https://docs.google.com/spreadsheets/d/1pSmxX6XGOxmoA7S7rKyj5OaEl3PmAl4jAOlROuNHrU0/edit#gid=0). Requiremetns from [JGI](https://jgi.doe.gov/) can be found at ???



Automatic conversion of one class from one LinkML file to a DataHarmonizer template:

```shell
poetry run linkml_to_dh_no_annotations \
  --model_yaml ../mixs-source/model/schema/mixs.yaml \
  --model_class soil \
  --tsv_out target/data.tsv
```

**Notes**:
- this `data..tsv` file still needs to be placed into a DH tempalte folder and [converted into `data.js`](https://github.com/cidgoh/DataHarmonizer/blob/master/script/make_data.py)
- the DH sections are arranged alphabetically, as are the collumns withing the sections. It is assumed that the tempate builder will want to reorder the sections at least, especially putting some "identifiers" section first, with the primary key column first within the section.

TODOS:
- explain other click options
- elaborate section and column ordering
- pattern tabulation seems broken

`make soil_biosample_dh` expands to

```shell
poetry run linkml_to_dh_no_annotations \
	--model_yaml interleaved.yaml \
	--model_class interleaved_class \
	--add_pattern_to_guidance
```
  
#### relationship between DataHarmonizer "guidance" and LinkML slots?

### Managing permissible values in LinkML [enumerations](https://linkml.io/linkml-model/docs/EnumDefinition/)
This code was developed in support of the IARPA Felix project and enhances ??? from [linkml-model-enrichment](https://github.com/linkml/linkml-model-enrichment)
