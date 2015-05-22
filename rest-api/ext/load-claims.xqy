xquery version "1.0-ml";

module namespace ext = "http://marklogic.com/rest-api/resource/load-claims";

declare default function namespace "http://www.w3.org/2005/xpath-functions";

declare namespace roxy = "http://marklogic.com/roxy";

(:
 : To add parameters to the functions, specify them in the params annotations.
 : Example
 :   declare %roxy:params("uri=xs:string", "priority=xs:int") ext:get(...)
 : This means that the get function will take two parameters, a string and an int.
 :)

(:
 :)
declare
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
function ext:post(
  $context as map:map,
  $params  as map:map,
  $input   as document-node()*
) as document-node()*
{
  let $output-types := map:put($context, "output-types", "application/json")
  let $response := json:object()
  let $_ := map:put($response, "status", "loaded claims")

  let $claims-file := "/Users/sfurlong/ML-Dev/ml-cook-show/data/claims_dump.csv"
  let $claims-doc := xdmp:document-get($claims-file)
  let $uri-prefix := "/content/claims/import-rest/"
  let $lines := tokenize($claims-doc, '\n')
  let $head := tokenize($lines[1], ',')
  let $body := remove($lines, 1)
  let $_ :=
    for $line at $idx in $body
      let $fields := tokenize($line, ',')
      let $doc :=
        <root>
        {
          for $key at $pos in $head
          let $value := $fields[$pos]
            return element { $key } { $value }
        }
        </root>
       let $doc-uri := fn:concat($uri-prefix, $idx, ".xml")
     return
       xdmp:document-insert($doc-uri, $doc,(),"claims")

  return (xdmp:set-response-code(200, "OK"), document { xdmp:to-json($response) })
};
