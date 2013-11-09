ua-parser-tools
===============

*Development Tools for ua-parser*

This project contains development tools which may help to add new regular expressions to the `regexes.yaml` file of the [ua-parser](https://github.com/tobie/ua-parser) Project.

From a file containing user-agent strings sorted csv-tables for the different parsers can be generated.
With the csv-tables the parsing results for the given user-agent strings can be compared.

To detect the matching parsing line in the `regexes.yaml`, debug information can be added to the file.


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

* *file:[filename]* : Instead of "useragents.txt" the file with "filename" is used as input.
* *swapdebug:true*  : Change the column for showing the regex matcher number from column one. The sorting of the resulting cvs-table will be different. This option allows to check different matchers for same model, brand or family.
* *testcases:true*  : Generate testcases file. All user-agents encountered in the testcases file will be appended


## Development Process

As an example the development process to add and change regular expressions
is depicted with adding new devices to the "device_parsers". For any other
parser you can follow the same steps with replacing `device.js` by either
`os.js` or `ua.js` .

1.  Add the debug information to the `regexes.yaml` file. For each
    "regex" a debug info in the form "#0001" will be added and counted up.

    ````
    node debuginfo.js
    ````

2.  Add your user-agents to the file `useragents.txt`.
3.  Parse the user-agents with the parser you like to change.
    E.g. here "device_parsers"

    ````
    node device.js
    ````

4.  Open the csv-output file in a spreadsheet or with

    ````
    less -Six12 report/device.csv
    ````

5.  Check the csv-table if the user-agents were parsed the way they should.
    In the first column the debug number will be displayed. If this is
    missing either no match was found (default should be "Other") or the
    debug information is missing in the `regexes.yaml`.
6.  Change one or more "regex" expressions in the `regexes.yaml` file.
    Parse the user-agents as in Step 3.
7.  Recheck list again. To get a different view by changing the sorting
    order with family or brand model first use:

    ````
    node device.js swapdebug:true
    ````

8.  If everything is as expected then re-run parsing with involving the
    testcases

    ````
    node device.js testcases:true
    ````

9.  This run writes the file `report/test_device.yaml` and maybe
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

10. If you are really sure that your changes do not corrupt the previous
    testcases and contain the right changes or corrections, remove the
    debuginfo from the `regexes.yaml` file with:

    ````
    node debuginfo.js
    ````

    Then you can copy the the generated `test_device.yaml` file to your
    fork of the **ua-parser** project.

11. Within your fork of the [ua-parser](https://github.com/tobie/ua-parser)
    project run the mocha tests with:

    ````
    npm test
    ````
12. If these tests did run without any problems then commit your changes
    and issue a pull-request.


## Advanced Settings

* *file:[filename]* : Instead of "useragents.txt" the file with "filename" is used as input.
* *swapdebug:true*  : Change the column for showing the regex matcher number from column one. The sorting of the resulting cvs-table will be different. This option allows to check different matchers for same model, brand or family.
* *testcases:true*  : Generate testcases file. All user-agents encountered in the testcases file will be appended
* *testcasesin:[filename]* : Use "filename" as testcases input file instead of the default one of the selected tool. Both YAML and JSON files can be used. Requires setting *testcases:true*.
* *testcasesout:[filename]* : Use "filename" as testcases output file instead of the default one of the selected tool. Both YAML and JSON files can be used. Requires setting *testcases:true*.
* *appenduas:false* : Usually the User-Agents of the testcases input file get appended to check for broken tests. If this is not desired, then use this setting. The User-Agents will be missing in the resulting testcases output file then.

### Conversions

In case that you just want to convert testcases from YAML to JSON you can do the following:

````
node os.js file:nouseragents.txt testcases:true testcasesout:mytests.json
````

This is in particuar usefull, if you are processing very large testcases with more than 500,000 User-Agents. Parsing JSON is pretty much faster here than YAML.

### Generate a new testcases file

To generate a complete new set of testcases 

````
node ua.js file:myuseragents.txt testcases:true appenduas:false testcasesout:mytests.json
````

### Run tests against you testcases file

````
node ua.js file:myuseragents.txt testcases:true testcasesin:mytests.json testcasesout:mytestsout.json
````
