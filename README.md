# MInAS - DataHarmonizer

This repository is a fork of [DataHarmonizer](https://github.com/cidgoh/DataHarmonizer) ([Gill et al. 2023](https://doi.org/10.1099/mgen.0.000908)) but utilised to view and test the LinkML schemas of the [MInAS project](https://mixs-minas.org).

## New template instructions

Initial set up of this fork:

- Clone the repository
- Install all dependencies set up as described below in the original [DataHarmonizer](https://github.com/cidgoh/DataHarmonizer?tab=readme-ov-file#prerequisites) with `yarn`
  - Configure `corepack` so `yarn` works properly
  - Run `yarn` to install dependencies
- Make sure you've installed [LinkML](https://linkml.io/)
- Make sure you've installed [linkml-toolkit](https://github.com/genomewalker/linkml-toolkit)
- Delete most of the contents of `/web/templates/` (leave one example until the new templates are added, and also `new/` for reference)
- Delete most of the contents of `menu.json` (leave one example until the new templates are added)
  - Set the example entries to `"display": false` in `menu.json`.

The instructions for adding a **single extension** to this repo's DataHarmonizer instance:

- Make new schema entry
  - Make a directory `/web/templates/[schema name]/` for each extension
  - In each directory create `export.js` just containing `export default {};`
    - `echo "export default {};" > export.js`
  - For each schema, save a `schema.yaml` file in the directory
  - Write a txt file called (`dh_class_text.txt`) which includes the text for an additional classed called [`dh_interface` class](https://github.com/cidgoh/DataHarmonizer?tab=readme-ov-file#making-templates)
  - Inject this class into the `schema.yaml` file with e.g. `sed -i '/^classes:/r dh_class_text.txt' schema.yml`
  - Generate the DataHarmonizer compatible JSON with `python ../../../script/linkml.py -i schema.yaml`
  - Modify the `/web/templates/menu.json` so all `"display": false` equals `"display": true` with `sed -i 's/"display": false/"display": true/g' ../menu.json`
    - If you still have an example, make sure to reset to false!
- Test in a local web server
  - Open a local webserver with `yarn dev`
  - Check you can see the new template under 'Template:` in the top bar
- Generate the static files (within the local clone)
  - Run `yarn build:web` to generate a standalone file (Stored in `/web/dist`)
- Remove the old docs directory at the root of the repository, the cp new static to replace it to allow rendering on GitHub pages
  - `rm -r docs/`
  - `cp -r web/dist/ docs/` 
- After moving, make the following edits:
  - _NOT WORKING_: `sed -i '/^<body>/r minas-dataharmonizer-header.txt' docs/index.html`

The instructions for adding a **full schema** to this repo's DataHarmonizer instance:

- One time: Make new schema entry
  - Make a directory `/web/templates/minas-checklists/` for the MInAS schema
  - In the directory create `export.js` just containing `export default {};`
    - `echo "export default {};" > export.js`
- For each schema, download the corresponding `schema.yaml` files in the directory, e.g.

    ```bash
    ## Core MIxS
    wget https://github.com/GenomicsStandardsConsortium/mixs/raw/refs/tags/v6.2.0/src/mixs/schema/mixs.yaml

    ## MInAS specific combinations
    wget https://github.com/MIxS-MInAS/minas-combinations/raw/refs/heads/main/src/mixs/schema/minas-combinations.yml

    ## Extensions
    wget https://github.com/MIxS-MInAS/extension-ancient/raw/refs/tags/v0.4.0/src/mixs/schema/ancient.yml
    wget https://github.com/MIxS-MInAS/extension-radiocarbon-dating/raw/refs/tags/v0.1.2/src/mixs/schema/radiocarbon-dating.yml
    ```

- Merge the different schemas together using linkml toolkit into one mega schema

  ```bash
  lmtk combine --mode merge --schema mixs.yaml -a ancient.yml -a radiocarbon-dating.yml -a minas-combinations.yml --output minas-total.yml
  ```

- Subset the mega schema to just those combinations relevant to MInAS (i.e., the ones in `minas-combinations.yml`)

  ```bash
  ## Update based on combinations from `minas-combinations.yml`
  lmtk subset --schema minas-total.yml --output minas.yml --classes MixsCompliantData,Ancient,RadiocarbonDating,MigsOrgHostAssociatedAncient,MigsOrgHumanAssociatedAncient,MiuvigHostAssociatedAncient,MiuvigHumanAssociatedAncient,MimagHostAssociatedAncient,MimagHumanAssociatedAncient,MimagHumanOralAncientMimagHumanGutAncient,MimagHumanSkinAncient,MimagSedimentAncient,MimagSkinAncient,MimsHostAssociatedAncient,MimsHumanAssociatedAncient,MimsHumanOralAncient,MimsHumanGutAncient,MimsHumanSkinAncient,MimsSedimentAncient,MimsSoilAncient,MimsPlantAncient,MimsSymbiontAncient
  ```

- TODO: CLEANUP COMMANDS
- One Time: Write a txt file called (`dh_class_text.txt`) which includes the text for an additional classed called [`dh_interface` class](https://github.com/cidgoh/DataHarmonizer?tab=readme-ov-file#making-templates)
- Inject this class into the `minas.yml` file with:

    ```bash
    sed -i '/^classes:/r dh_class_text.txt' minas.yml
    ```
  
  - Generate the DataHarmonizer compatible JSON with:

    ```bash
    python ../../../script/linkml.py -i minas.yml
    ```

  - Modify the `/web/templates/menu.json` so all `"display": false` equals `"display": true` with 

  ```bash
  sed -i '15,$s/"display": false/"display": true/g' ../menu.json
  ```

  TODO: CHANGE COMMAND ABOVE TO INStEAD FILTER MENU.JSON TO OBJETS OF INTEREST 

  - If you still have an example template from the original dataharmonizer repo, make sure to reset to false! (Sed command above skips first 15 lines as we keep an mpox example)
- Test in a local web server
  - Open a local webserver with `yarn dev`
  - Check you can see the new template under 'Template:` in the top bar
- Generate the static files (within the local clone)
  - Run `yarn build:web` to generate a standalone file (Stored in `/web/dist`)
- Back in the root of the repo, remove the old docs directory, the cp new static to replace it to allow rendering on GitHub pages
  - `rm -r docs/`
  - `cp -r web/dist/ docs/`

This viewing interface should be updated on each MInAS release.

### New template quick reference

Example for the ancient extension

```bash
cd /web/templates/
rm -r *
mkdir mixs-extension-ancient
cd mixs-extension-ancient
echo "export default {};" > export.js
wget https://github.com/MIxS-MInAS/extension-ancient/raw/refs/tags/v0.3.2/src/mixs/schema/ancient.yml
## Add the dh_interface class to the file manually here to a file called 'dh_class_text.txt'!
sed -i '/^classes:/r dh_class_text.txt' ancient.yml
python3 ../../../script/linkml.py --input ancient.yml
sed -i 's/"display": false/"display": true/g' ../menu.json
## optionally test with `yarn dev`
yarn build:web
mv web/dist/ docs/
```

## Original README

A standardized browser-based spreadsheet editor and validator that can be run offline and locally, which works of of [LinkML](https://linkml.io/) data specifications. This open source project, created by the Centre for Infectious Disease Genomics and One Health (CIDGOH) at Simon Fraser University, is now a collaboration with contributions from the National Microbiome Data Collaborative (NMDC), the LinkML development team, and others. Read the open-source DataHarmonizer [manuscript](#manuscript) for more about the application's theory and design.

Watch Rhiannon Cameron and Damion Dooley describe this application on [YouTube](https://www.youtube.com/watch?v=rdN2_Vhwb8E&t=38s&ab_channel=CANARIEInc.) at the Canadian Research Software Conference (CRSC2021).

|Chrome|Firefox|Edge|
|---|---|---|
|49+|34+|12+|

## Pathogen Genomics Templates

Note that the **Pathogen Genomics Package** of DataHarmonizer templates, which includes Covid-19 and Monkeypox, is available now as a simpler stand-alone zip file at [https://github.com/cidgoh/pathogen-genomics-package](https://github.com/cidgoh/pathogen-genomics-package). This version does not require the use of the developer environment and can be run simply by loading the `index.html` or `main.html` files in your local web browser.

![alt text](./images/editCopyPasteDelete.gif)

## Manuscript

**The DataHarmonizer: a tool for faster data harmonization, validation, aggregation and analysis of pathogen genomics contextual information**

Microbial Genomics (9:1) 2023

DOI: https://doi.org/10.1099/mgen.0.000908

_Ivan S. Gill, Emma J. Griffiths​, Damion Dooley​, Rhiannon Cameron​, Sarah Savić Kallesøe​, Nithu Sara John​, Anoosha Sehar​, Gurinder Gosal​, David Alexander​, Madison Chapel​, Matthew A. Croxen​​, Benjamin Delisle​, Rachelle Di Tullio​, Daniel Gaston​, Ana Duggan​, Jennifer L. Guthrie​, Mark Horsman4​, Esha Joshi​, Levon Kearny​, Natalie Knox​, Lynette Lau​, Jason J. LeBlanc9, Vincent Li​, Pierre Lyons​, Keith MacKenzie1, Andrew G. McArthur​, Emily M. Panousis​, John Palmer​, Natalie Prystajecky​, Kerri N. Smith​, Jennifer Tanner​, Christopher Townend​, Andrea Tyler, Gary Van Domselaar​, William W. L. Hsiao_

## Installation

This repository contains a full DataHarmonizer development environment including the scripts necessary to generate a code library for **API** use, as well as the stand-alone version. Instructions for setting this up is in the **Development** section below. The API is used by the https://data.microbiomedata.org/ project for data collection.  Using the API allows DataHarmonizer to be presented in a custom user interface, with a specific template pre-loaded for example, and select controls menu items constructed as desired in the interface.

# Stand-Alone DataHarmonizer Functionality

In addition to API use, as detailed in the **Development** section, the development environment includes a script for generating a stand-alone browser-based version of DataHarmonizer that includes templates for detailing **SARS-CoV-2 and Monkeypox** sample contextual data.  More infectious disease templates will be included in the comming year. Other organizations are adopting this version of DataHarmonizer for their own data management purposes.

## Select Template

The default template loaded is the "CanCOGeN Covid-19" template. To change the spreadsheet template, select the white text box to the right of **Template**, it always contains the name of the template currently active, or navigated to **File** followed by **Change Template**. An in-app window will appear that allows you to select from the available templates in the drop-down menu. After selecting the desired template, click **Open** to activate the template.

![change template](./images/changeTemplate.gif)

A second way to access templates directly, rather than by the hard-coded menu system, is to specify the DataHarmonizer template subfolder via a "template" URL parameter. This enables development and use of customized templates, or new ones, that DH doesn't have programmed in menu.  

For example,
http://genepio.org/DataHarmonizer/main.html?template=gisaid accesses the /template/gsiaid/ subfolder's template directly.  

See more on the Wiki [DataHarmonizer templates](https://github.com/Public-Health-Bioinformatics/DataHarmonizer/wiki/DataHarmonizer-Templates) page.

## Usage

You can edit the cells manually, or upload `xlsx`, `xls`, `tsv`, `csv` and `json` files via **File** > **Open**. You can also save the spreadsheet's contents to your local hard-drive in the aforementioned formats, or **File** > **Export** your data as a document formatted for submission a specified portal, database, or repository.

![saving and exporting files](./images/exportingFiles.gif)

Click the **Validate** button to validate your spreadsheet's values against a
standardized vocabulary. You can then browse through the errors using the **Next Error** button. Missing value are indicated in _dark red_, while incorrect values are _light red_. After resolving these errors, revalidate to see if any remain. If there are no more errors the “Next Error” button will change to “No Errors” and then dissapear.

![validating cells and checking next error](./images/validatingCells.gif)

Double click any column headers for information on the template's vocabulary. This usually includes the definition of the field, guidance on filling in the field, and examples of how data might look structured according to the constraints of the validator.

![double click headers for more info](./images/doubleClickHeaders.gif)

You can quickly navigate to a column by selecting **Settings** > **Jump to...**. An in-app window will appear, select the desired column header from the drop-down list or begin typing its name to narrow down the list options. Selecting the column header from the drop down list will immediately relocate you to that column on the spreadsheet.

![jump to column](./images/jumpToColumn.gif)

You can also automatically fill a column with a specified value, but only in rows with corresponding values in the first `sample ID` column. To use this feature select **Settings** > **Fill column...**. Select the desired column header from the drop-down list or begin typing its name to narrow down the list options, then specify the value to fill with and click **Ok** to apply.

![fill column, in rows with corresponding sample IDs, with specified value](./images/fillColumn.gif)

For _more information_ on available application features, select the **Help** button followed by **Getting Started** from within the DataHarmonizer application or navigate to the [**Getting Started**](https://github.com/cidgoh/DataHarmonizer/wiki/DataHarmonizer---Getting-Started) GitHub wiki..

## Example Data

The stand-alone version of DataHarmonizer when built is placed in the /web/dist/ folder, with the following structure.  Templates with example data testing functionalities can be found within the following folder structure leading to the "exampleInput/" folder, when available:

```
. TOP LEVEL DIRECTORY
├── images
├── libraries
├── script
└── template
│   ├── templateOfInterest
│   │   └── exampleInput
│   └── ...
```

Note that the source of the built "template/" folder above is actually in /web/templates/, where example input data should be placed before performing the build process.  Here is an example that links to all available test data for the CanCOGeN Covid-19 template:

- [`canada_covid19`](https://github.com/cidgoh/DataHarmonizer/tree/master/web/templates/canada_covid19/exampleInput) CanCOGeN Covid-19


## Version Control

Versioning of templates, features, and functionality is modeled on semantic versioning (i.e. versions are expressed as “DataHarmonizer X.Y.Z”).
Changes to vocabulary in template pick lists are updated by incremental increases to the third position in the version (i.e. “Z” position).
Changes to fields and features are updated by incremental increases to the second position in the version (i.e. “Y” position).
Changes to basic infrastructure or major changes to functionality are updated by incremental increases to the first position in the version (i.e. “X” position).

Descriptions of updates are provided in [release notes](https://github.com/cidgoh/DataHarmonizer/releases) for every new version.

Discussions contributing to updates may be tracked on the DataHarmonizer GitHub issue tracker.

# Development

Code in this repository is split mainly between two folders: `lib` and `web`. The `lib` folder contains the core interface components which are published to NPM and can be used by any client to build a user interface. The `web` folder contains an implementation of one such interface, using the components defined in `lib`. The interface implemented in the `web` folder is packaged and [made available to users as releases of this repository](#Installation).

## Prerequisites

For development, you must have [Node.js](https://nodejs.org) and [Yarn](https://yarnpkg.com/getting-started/install) installed. If you have Node.js version 16.10 or later (highly recommended) and you have not used Yarn before, you can enable it by running:

```shell
corepack enable
```

## Installing

To install the dependencies of this package for development simply run:

```shell
yarn
```

## Running Locally

Developing either the library components in `lib` or the interface in `web` can be done using the same command:

```shell
yarn dev
```

This will start a [webpack development server](https://webpack.js.org/configuration/dev-server/) running locally on `localhost:8080`. You can connect to `localhost:8080` by inputing it into your browser URL bar while `yarn dev` is running. Changes to either `lib` or `web` should be loaded automatically in your browser. This serves as interface for testing and debugging the core library components (in the lib directory) and that interface itself (the web directory).

## Publishing and Releasing

To bundle the canonical interface run:

```shell
yarn build:web
```
You can open `web/dist/index.html` in your browser to test the distributable bundle and verify it runs in "offline".

To bundle the library components into lib/dist for downstream clients to use via API instead of the canonical interface, run:

```shell
yarn build:lib
```

## Making templates

With a `[schema name]` of your choice, work in **`/web/templates/[schema name]/`**
- Add one almost empty file **`export.js`** to the same folder.   It contains:
```
// A dictionary of possible export formats
export default {};
```
- Assemble one **`schema.yaml`** file by hand. It should be a merger of a valid linkml `schema.yaml` file (your existing schema) and at least an extra **`dh_interface`** class. The `dh_interface` class signals to DH to show the given class as a template menu option. Below we are using an AMBR class as an example:
 
```
classes:
  dh_interface:
    name: dh_interface
    description: A DataHarmonizer interface
    from_schema: https://example.com/AMBR # HERE CHANGE TO [schema name] URI
  AMBR:    # HERE CHANGE TO [schema name]
    name: AMBR
    description: The AMBR Project, led by the Harrison Lab at the University of Calgary,
      is an interdisciplinary study aimed at using 16S sequencing as part of a culturomics
      platform to identify antibiotic potentiators from the natural products of microbiota.
      The AMBR DataHarmonizer template was designed to standardize contextual data
      associated with the isolate repository from this work.
    is_a: dh_interface
```
 - Optionally add all the `types: {}` from one of the other specification `schema.core.yaml` file examples existing in `/web/templates/`, since this allows DH things like the "provenance" slot, and allows use of the `whitespaceMinimizedString` datatype which blocks unnecessary spaces, but this is not essential.

```
types:
  WhitespaceMinimizedString:
    name: 'WhitespaceMinimizedString'
    typeof: string
    description: 'A string that has all whitespace trimmed off of beginning and end, and all internal whitespace segments reduced to single spaces. Whitespace includes #x9 (tab), #xA (linefeed), and #xD (carriage return).'
    base: str
    uri: xsd:token
  Provenance:
    name: 'Provenance'
    typeof: string
    description: 'A field containing a DataHarmonizer versioning marker. It is issued by DataHarmonizer when validation is applied to a given row of data.'
    base: str
    uri: xsd:token
```
- Generate the `schema.json` file in that file’s template folder (`/web/templates/[schema name]/`) by running

```shell
python ../../../script/linkml.py -i schema.yaml
```
 
This will also add a menu item for your specification by adjusting `/web/templates/menu.json`.

- Check the updated `/web/templates/menu.json`. With this example, the template menu will be "ambr/AMBR".

```json
 "ambr": {
    "AMBR": { # Make sure the right class is called by DH
      "name": "AMBR",
      "status": "published",
      "display": true # Make sure the status is set to true
    }
```
 
- Test your template, by going to the DH root folder and type (as documented on github main code page):

```shell
yarn dev
```

You can then browse to <http://localhost:8080> to try out the template.

- you can then build a stand alone set of JS files in `/web/dist/`

```shell
yarn build:web
```
The `/web/dist/` folder can then be zipped or copied separately to wherever you want to make the app available.


`TODO: describe how to use the DataHarmonizer javascript API.`

## Roadmap

This project is now in production, with new features being added occasionally.  The [Projects](https://github.com/cidgoh/DataHarmonizer/projects/1) tab indicates anticipated functionality.

# Support

If you have any ideas for improving the application, or have encountered any problems running the application, [please open an issue for discussion][1].

[1]: https://github.com/Public-Health-Bioinformatics/DataHarmonizer/issues

## Additional Information

For more information about the DataHarmonizer, it's templates, and how to use them, check out the [DataHarmonizer Wiki](https://github.com/Public-Health-Bioinformatics/DataHarmonizer/wiki).

## Acknowledgement

- [Handsontable](https://handsontable.com/) was used to build the grid.  DataHarmonizer is configured to reference the "non-commercial-and-evaluation" handsontable license "for purposes not intended toward monetary compensation such as, but not limited to, teaching, academic research, evaluation, testing and experimentation"; if this application is used for commercial purposes, this should be revised as per https://handsontable.com/docs/license-key/
- [SheetJS](https://sheetjs.com/) was used to open and save local files. The community edition was used under the [Apache 2.0](https://github.com/SheetJS/sheetjs/blob/master/LICENSE) license.

## License

DataHarmonizer javascript, python and other code not mentioned in the Acknowledgement above is covered by the [MIT](LICENSE) license.

