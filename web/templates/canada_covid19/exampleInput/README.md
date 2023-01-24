# CanCOGeN Example Input Data

This directory contains example input/test data for the Canadian COVID Genomics Network (CanCOGeN) DataHarmonizer application template: `CanCOGeN Covid-19`. This data is appropriate for testing up to the version appended to the end of the file name, for example:

- `validTestData_2-1-2.csv` is _valid_ for version `2-1-2` of the DataHarmonizer template.
- `invalidTestData_1-0-0.csv` is still _invalid_ for version `2-1-2` of the DataHarmonizer template, and thus can still be used to explore validation features.

## Valid Test Data

Demonstrates _valid_ example input, from controlled vocabulary and date formats to free text strings, for all minimal metadata fields and some recommended/enhanced metadata fields.

## Invalid Test Data

Demonstrates _invalid_ example input, from controlled vocabulary and date formats, for all minimal metadata fields and some recommended/enhanced metadata fields. After validating, empty cells that require input appear dark red while invalid cell contents appear light red.

There are special validation rules for some fields, for example:

- There cannot be duplicates of the database identifier `specimen collector sample ID` field. When duplicates occur the corresponding cells will be flagged light red:

> ![invalidData_specimenCollectorSampleID.png](/images/invalid/invalidData_specimenCollectorSampleID.png?raw=true)

- Sample collection date cannot be before SARS-CoV-2 sampling began even when formatted using the appropriate ISO 8601 standard format "YYYY-MM-DD":

> ![invalidData_sampleCollectionDate.png](/images/invalid/invalidData_sampleCollectionDate.png?raw=true)
