# ua-parser-tools

> Development Tools for Development Tools for uap-core (ua-parser)

This project contains development tools which may help to add new regular expressions to the `regexes.yaml` file of the [uap-core](https://github.com/ua-parser/uap-core) Project.

From a file containing user-agent strings sorted csv-tables for the different parsers can be generated.
With the csv-tables the parsing results for the given user-agent strings can be compared.

To detect the matching parsing line in the `regexes.yaml`, debug information can be added to the file.

## Table of Contents

<!-- !toc (minlevel=2 omit="Table of Contents") -->

* [General Files](#general-files)
* [Files to generate lists and add test cases](#files-to-generate-lists-and-add-test-cases)
* [Quick guide to get this project up and running](#quick-guide-to-get-this-project-up-and-running)
* [Development Process](#development-process)
* [Advanced Settings](#advanced-settings)
  * [Conversions](#conversions)
  * [Add unmatched entries to the testcases file](#add-unmatched-entries-to-the-testcases-file)
  * [Generate a new testcases file](#generate-a-new-testcases-file)
  * [Run tests against you testcases file](#run-tests-against-you-testcases-file)
* [Special Tools](#special-tools)

<!-- toc! -->

## General Files

**useragents.txt**
List of user-agents which are used as input. Each line shall contain one user-agent string.

**debuginfo.js**
Add or remove debug information to the `regexes.yaml` file. Run the file with `node debuginfo.js`.<br>
Please *remove* the debug infomation before commiting the changed `regexes.yaml` file.

**config.js**
Configuration settings to locate the `test_resources` and the `regexes.yaml` file.


## Files to generate lists and add test cases

**ua.js**
Parse the user-agents with the ua-parser.

**os.js**
Parse the user-agents with the os-parser.

**device.js**
Parse the user-agents with the device-parser.

All files can be used with the following arguments:

* *-u PATH* : Instead of "useragents.txt" the file with "PATH" is used as input.
* *-s*  : Change the column for showing the regex matcher number from column one. The sorting of the resulting cvs-table will be different. This option allows to check different matchers for same model, brand or family.
* *-t*  : Generate testcases file. All user-agents encountered in the testcases file will be appended


## Quick guide to get this project up and running

1. Install node from [nodeJS](https://nodejs.org/download/)

2. Clone this project and run

   ````
   git clone https://github.com/commenthol/ua-parser-tools.git
   npm install
   ````

## Development Process

As an example the development process to add and change regular expressions
is depicted with adding new devices to the "device_parsers". For any other
parser you can follow the same steps with replacing `device.js` by either
`os.js` or `ua.js` .

1. Clone (or fork) the `ua-parser` project within this directory.

   ````
   git clone https://github.com/ua-parser/uap-core.git
   ````

   *Note:* If you have forked `uap-core` into a different dir adapt the setting `config.ua_parser.dir` in `config.js` accordingly.

2. Add the debug information to the `regexes.yaml` file. For each
   "regex" a debug info in the form "#0001" will be added and counted up.

   ````
   node debuginfo.js
   ````

3. Add your user-agents to the file `useragents.txt`.
4. Parse the user-agents with the parser you like to change.
   E.g. here "device_parsers"

   ````
   node device.js
   ````

5. Open the csv-output file in a spreadsheet or with

   ````
   less -Six12 report/device.csv
   ````

6. Check the csv-table if the user-agents were parsed the way they should.
   In the first column the debug number will be displayed. If this is
   missing either no match was found (default should be "Other") or the
   debug information is missing in the `regexes.yaml`.
7. Change one or more "regex" expressions in the `regexes.yaml` file.
   Parse the user-agents as in Step 3.
8. Recheck list again. To get a different view by changing the sorting
   order with family or brand model first use:

   ````
   node device.js -s
   ````

9. If everything is as expected then re-run parsing with involving the
   testcases

   ````
   node device.js -t
   ````

10. This run writes the file `report/test_device.yaml` and maybe
    `report/device.log`. In `device.log` all broken tests are reported.
    The file `test_device.yaml` writes a new testcases file which contains
    the results for the changed `regexes.yaml` file.
    All testcases (even for "broken" ones) get updated.
    You can check the differences with:

    ````
    diff report/test_device.yaml ua-parser/test_resources/test_device.yaml
    ````
    I recommend [diffuse](http://diffuse.sourceforge.net/index_de.html)
    in case you should prefer a GUI-based difftool.

11. If you are really sure that your changes do not corrupt the previous
    testcases and contain the right changes or corrections, remove the
    debuginfo from the `regexes.yaml` file with:

    ````
    node debuginfo.js
    ````

    Then you can copy the the generated `test_device.yaml` file to your
    fork of the **ua-parser** project.

12. Within your fork of the [ua-parser](https://github.com/tobie/ua-parser)
    project run the mocha tests with:

    ````
    npm test
    ````

13. If these tests did run without any problems then commit your changes
    and issue a pull-request.


## Advanced Settings

````
Options:
  -u, --ua PATH          Read user-agent strings from file
  -o, --out PATH         Write output files .cvs, .log
  -t, --tc               Process testcases.
      --tcin PATH        Read testcases from file
      --tcout PATH       Write testcases to file
  -c, --console          Output to console
      --other            Add unmatched user-agents to testcases output file
  -s, --swapdebug        Swap debug field in .csv output
  -d, --nodebug          Do not show debug field in .cvs output
  -f, --nofamily         Do not show family field in .csv output (device.js only)
  -a, --noappend         Do not append user-agent strings from -u
  -h, --help             Display help and usage details
````

* *-u PATH* : Instead of "useragents.txt" the file with "PATH" is used as input.
* *-s*  : Change the column for showing the regex matcher number from column one. The sorting of the resulting cvs-table will be different. This option allows to check different matchers for same model, brand or family.
* *-t*  : Generate testcases file. All user-agents encountered in the testcases file will be appended
* *--tcin PATH* : Use "PATH" as testcases input file instead of the default one of the selected tool. Both YAML and JSON files can be used. Requires setting *testcases:true*. If "#" is used as input, no file is used, thus allowing generation of new testcase files.
* *--tcout PATH* : Use "PATH" as testcases output file instead of the default one of the selected tool. Both YAML and JSON files can be used. Requires setting *testcases:true*.
* *-o* : Add also unmatched user-agents to testcases. Requires setting *testcases:true*.
* *-a* : Usually the User-Agents of the testcases input file get appended to check for broken tests. If this is not desired, then use this setting. The User-Agents will be missing in the resulting testcases output file then.

### Conversions

In case that you just want to convert testcases from YAML to JSON you can do the following:

````
node os.js -u no -t --tcout mytests.json
````

This is in particuar usefull, if you are processing very large testcases with more than 500,000 User-Agents. Parsing JSON is pretty much faster here than YAML.

### Add unmatched entries to the testcases file

````
node device.js -u myuseragents.txt -t --tcout mytests.json -o
````

### Generate a new testcases file

To generate a complete new set of testcases

````
node ua.js -u myuseragents.txt -t --tcin no --tcout mytests.json
````

### Run tests against you testcases file

````
node ua.js -u myuseragents.txt -t --tcin mytests.json --tcout mytestsout.json
````

## Special Tools

To generate a uniq set of test-vectors from text files containing user-agent strings the tool `uniq.js` together with a previous `sort.js` can be used.

Check `sort.js -h` and `uniq.js -h` for usage.

Typical use:

    # sort the useragents - Mozilla ... gets first
    ./sort.js -u useragents.txt > u.tmp
    # the debuginfo needs to be present for `uniq.js` to work
    ./debuginfo.js
    ./uniq.js -t device -u u.tmp

