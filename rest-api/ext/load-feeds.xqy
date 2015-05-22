xquery version "1.0-ml";

module namespace ext = "http://marklogic.com/rest-api/resource/load-feeds";

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
%roxy:params("uri=xs:string", "limit=xs:int?")
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
%roxy:params("uir=xs:string", "limit=xs:int?")
function ext:post(
  $context as map:map,
  $params  as map:map,
  $input   as document-node()*
) as document-node()*
{
  let $output-types := map:put($context, "output-types", "application/json")
  let $response := json:object()
  let $_ := map:put($response, "status", "loaded feeds")

  let $feed-file-path := "/Users/sfurlong/ML-Dev/ml-cook-show/data/feeds.xml"
  let $feed-doc := xdmp:document-get($feed-file-path)

  let $_ :=
    for $feed in ($feed-doc/feeds/feed)
      let $feed-uri := string($feed)
      let $feed-name := substring-before(fn:tokenize($feed-uri, "/")[fn:last()], ".xml")
      let $feed :=  xdmp:http-get($feed-uri, ())[2]
      for $item in $feed//item
        let $doc-uri := fn:concat("/article-feed/" , $feed-name , "/", string($item/guid),".xml")
        let $date-pts := fn:tokenize( string($item/pubDate), " ")
        let $dateTime := xs:dateTime(xs:date( fn:concat($date-pts[4],"-",ext:monthStr-to-number($date-pts[3]),"-",$date-pts[2])))
        let $modPubDate := element modPubDate {$dateTime}
        let $type := element type {"feed"}
        let $doc := element doc {$item/*, $modPubDate, $type }
        return xdmp:document-insert($doc-uri, $doc,(),"feeds")

  return (xdmp:set-response-code(200, "OK"), document { xdmp:to-json($response) })
};


declare function ext:monthStr-to-number ( $dateStr as xs:string ) {
   let $months :=  ('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')
   let $idx := fn:index-of($months,$dateStr)
   return if ($idx<10) then fn:concat("0", $idx) else $idx
};
