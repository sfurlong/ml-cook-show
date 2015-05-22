xquery version "1.0-ml";

module namespace ext = "http://marklogic.com/rest-api/resource/run-sql";

declare default function namespace "http://www.w3.org/2005/xpath-functions";

declare namespace roxy = "http://marklogic.com/roxy";
declare namespace bjson = "http://marklogic.com/xdmp/json/basic";

import module namespace sql = "http://xqdev.com/sql" at "/lib/sql.xqy";

import module namespace json = "http://marklogic.com/xdmp/json" at "/MarkLogic/json/json.xqy";

(:
 : To add parameters to the functions, specify them in the params annotations.
 : Example
 :   declare %roxy:params("uri=xs:string", "priority=xs:int") ext:get(...)
 : This means that the get function will take two parameters, a string and an int.
 :)

(:
 :)
declare
%roxy:params("uri=xs:string")
function ext:get(
  $context as map:map,
  $params  as map:map
) as document-node()*
{
  ext:post($context, $params, ())
};

(:
 :)
declare
%roxy:params("uir=xs:string")
function ext:post(
  $context as map:map,
  $params  as map:map,
  $input   as document-node()*
) as document-node()*
{
  let $output-types := map:put($context, "output-types", "application/json")
  let $payload := json:transform-from-json($input)
  let $query := $payload//bjson:query/text()
  let $_ := xdmp:log($query)
  (:let $sql-data := sql:execute("select * from member", "http://localhost:8080/mlsql/", ()):)
  let $sql-data := sql:execute($query, "http://localhost:8080/mlsql/", ())
  let $tuples := json:transform-to-json-object($sql-data//sql:tuple, json:config("full"))

  let $response := json:object()
  let $_ := map:put($response, "results", $tuples)

  return (xdmp:set-response-code(200, "OK"), document { xdmp:to-json($response) })
};

