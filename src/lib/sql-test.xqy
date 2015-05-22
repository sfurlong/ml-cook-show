xquery version "0.9-ml"

(:~
 : Mark Logic Interface to Relational Databases
 :
 : For a tutorial please see
 : http://xqzone.marklogic.com/howto/tutorials/2006-04-mlsql.xqy.
 :
 : Copyright 2007 Jason Hunter and Ryan Grimm
 :
 : Licensed under the Apache License, Version 2.0 (the "License");
 : you may not use this file except in compliance with the License.
 : You may obtain a copy of the License at
 :
 :     http://www.apache.org/licenses/LICENSE-2.0
 :
 : Unless required by applicable law or agreed to in writing, software
 : distributed under the License is distributed on an "AS IS" BASIS,
 : WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 : See the License for the specific language governing permissions and
 : limitations under the License.
 :
 : @author Jason Hunter and Ryan Grimm
 : @version 1.0.1
 :)

import module namespace sql  = "http://xqdev.com/sql" at "sql.xqy"

define function sql:test($expected as item()*, $actual as item()*,
 $raw as item()?)
as xdt:anyAtomicType
{
  (: deep-equal doesn't work with cts:query items,
   : so we do extra work - bug 3287 (scheduled to be fixed in 3.3).
   :)

  if (deep-equal($actual, $expected)
    or xdmp:quote($actual) eq xdmp:quote($expected) )
  then true()
  else concat("ERROR! ",
    if (empty($raw)) then () else concat(xdmp:quote($raw), ": "),
    if (empty($actual)) then "()" else xdmp:quote($actual),
    " ne ", xdmp:quote($expected))
}


xdmp:set-response-content-type("text/html; charset=utf-8"),
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>sql.xqy: unit tests</title>
  </head>
  <body>
    <h1>sql.xqy: unit tests</h1>
  
    <p>If any of the following tests return "false",
    please contact the module author(s).</p>

    <div>
      <h2>Public Function</h2>
      <p>sql:params</p>
      <p>
      {
        let $testCaseVals := (1)
        let $params := sql:params($testCaseVals)
        return 
          if (count($params//sql:parameter) = 1 and $params//sql:parameter/@type = "int")
          then
            concat("Test 1: true")
          else
            concat("Test 1: Failure. Recieved the following from sql:params, ", xdmp:quote($params))
      }
      <br/>
      {
        let $testCaseVals := (1, "foo")
        let $params := sql:params($testCaseVals)
        return 
          if (count($params//sql:parameter) = 2 and ($params//sql:parameter/@type)[1] = "int"
               and ($params//sql:parameter/@type)[2] = "string")
          then
            "Test 2: true"
          else
            concat("Test 2: Failure. Recieved the following from sql:params, ", xdmp:quote($params))
      }
      <br/>
      {
        let $testCaseVals := (<sql:long/>, "goo", xs:date("2002-07-30-09:00"))
        let $params := sql:params($testCaseVals)
        return
          if (count($params//sql:parameter) = 3 and 
               $params//sql:parameter[1]/@type = "long" and 
               $params//sql:parameter[1]/@null = "true" and 
               $params//sql:parameter[2]/@type = "string" and 
               $params//sql:parameter[3]/@type = "date" )
          then
            concat("Test 3: true")
          else
            concat("Test 3: Failure. Recieved the following from sql:params, ", xdmp:quote($params))
      }
      <br/>
      {
        let $testValue := sql:params(<sql:int out="true"/>)
        return
          concat("Test 4: ", sql:test($testValue//@out, "true", "Failed"))
      }
      <br/>
      {
        let $testValue := sql:params(<sql:int out="false"/>)
        return
          concat("Test 5: ", sql:test(string($testValue//@out),"" , "Failed"))
      }
      </p>

      <h2>Internal Functions</h2>
      <p>sql:_isSqlElement</p>
      <p>
      {        
        let $testInputs := (<sql:foo/>, <foo/>, "")
        let $expectedResults := (true(), false(), false())
        for $input at $x in $testInputs
        return
        (
          concat("Test ", $x, ": ",
            sql:test(sql:_isSqlElement($input), $expectedResults[$x], "Failed")),
          <br/>
        ),
        concat("Test 4: ", sql:test(sql:_isSqlElement(()), false(), "Failed"))
      }
      </p>

      <p>sql:_getType</p>
      {
        let $inputs := (true(), xs:double(4.5), xs:float(.001), xs:short(1), xs:long(1000000000), 3, "foo", xs:date("2002-07-30-09:00"), xs:time("21:37:32-08:00"), xs:dateTime("2002-07-30T23:32:15.32-09:00"), <sql:boolean/>, <sql:double/>, <sql:float/>, <sql:short/>, <sql:long/>, <sql:decimal/>, <sql:string/>, <sql:date/>, <sql:time/>, <sql:dateTime/>, <sql:blob/>, <sql:longVarBinary/>)
        let $outputs := ("boolean", "double", "float", "short", "long", "int", "string", "date", "time", "timestamp", "boolean", "double", "float", "short", "long", "int", "string", "date", "time", "timestamp", "blob", "longvarbinary")
        for $testValue at $i in $inputs
        return 
        (
          concat("Test ", $i, ": ", 
            sql:test(sql:_getType($testValue), $outputs[$i], "Failed")),
          <br/>
        )
      }
    </div>
  </body>
</html>

