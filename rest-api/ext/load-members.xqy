xquery version "1.0-ml";

module namespace ext = "http://marklogic.com/rest-api/resource/load-members";

declare default function namespace "http://www.w3.org/2005/xpath-functions";

declare namespace roxy = "http://marklogic.com/roxy";

import module namespace sql = "http://xqdev.com/sql" at "/lib/sql.xqy";

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
  let $sql-data := sql:execute("select * from member", "http://localhost:8080/mlsql/", ())
  let $members :=
    for $sql-tuple in ($sql-data//sql:tuple)
    let $uri := fn:concat("/mysql/member/", string($sql-tuple/id),".xml")
    let $mod-date := xs:dateTime( ext:date-str-to-datetime($sql-tuple/lastMod/text()) )
    let $mod-elem := <modDate>{$mod-date}</modDate>
    let $full-name := <fullName>{fn:concat($sql-tuple/firstName/text(), " ", $sql-tuple/lastName/text())}</fullName>
    let $geo-data := ext:get-geo-for-zip($sql-tuple/zipcode)
    let $member := <member>{$full-name, $sql-tuple/*[name() != 'lastMod'], $mod-elem, $geo-data}</member>

    (: Add the member data to the <members> collection :)
    let $_ := xdmp:document-insert($uri, $member,(),"members")

    (: Update claims that reference this member. :)
    return ext:update-claims( $member )

  let $response := json:object()
  let $_ := map:put($response, "status", "loaded member data")

  return (xdmp:set-response-code(200, "OK"), document { xdmp:to-json($response) })
};


(:
 Converts date formatted liked [2015-04-03 12:20:32.0] to [2015-04-03T12:20:32].
:)
declare function ext:date-str-to-datetime ( $dateStr as xs:string ) {
   let $mod := replace($dateStr, "^(\d{4}-\d{2}-\d{2}) ", "$1T")
   let $mod := replace($mod, "\\.0", "")
   return $mod
};

(:
 Update claims documents that contain a reference to the specified member.
:)
declare function ext:update-claims( $member ) {
  let $claims := cts:search(
    collection("claims"),
    cts:element-query(xs:QName("ANON_MBR_ID"), $member/id/text())
  )

  return
    for $rec in ($claims)
    let $uri := fn:document-uri($rec)
    return (
      if (fn:document($uri)//member) then
        xdmp:node-replace(fn:document($uri)//member, $member)
      else
        xdmp:node-insert-after($rec/root/ANON_MBR_ID, $member)
    )
};

(:
 Get geospatial information for the specified zipcode.
:)
declare function ext:get-geo-for-zip( $zipcode ) {
  let $query := fn:concat("select latitude, longitude from geonamesPostcode where postalCode = '", $zipcode, "'")
  let $sql-data := sql:execute($query, "http://localhost:8080/mlsql/", ())
  return $sql-data//sql:tuple/*
};

