xquery version "1.0-ml";

module namespace ext = "http://marklogic.com/rest-api/resource/datasources";

import module namespace json = "http://marklogic.com/xdmp/json"
  at "/MarkLogic/json/json.xqy";

declare namespace json-basic = "http://marklogic.com/xdmp/json/basic";


declare
function ext:get(
  $context as map:map,
  $params  as map:map
) as document-node()*
{
  map:put($context, "output-types", "application/json"),
  let $a := json:array()
  let $_ :=
  (
    json:array-push($a, map:new((
      map:entry("name", "Medical Feeds"),
      map:entry("description", "RSS feeds of Medical News Today are used to retreive medical information headlines."),
      map:entry("format", "XML documents. RSS feed headlines retreived in XML format."),
      map:entry("url", "http://www.medicalnewstoday.com/rss/"),
      map:entry("count", xdmp:estimate(fn:collection("feeds")))
    ))),
    json:array-push($a, map:new((
      map:entry("name", "Claims Records"),
      map:entry("description", "Anonymized patients claim records which includes age, drugs prescribed, dates patient was seen, member id, pharmacy id, physician id, prescriber id, etc."),
      map:entry("format", "XML documents. CSV File converted to 1 XML document per line"),
      map:entry("url", "N/A"),
      map:entry("count", xdmp:estimate(fn:collection("claims")))
    ))),
    json:array-push($a, map:new((
      map:entry("name", "Members"),
      map:entry("description", "Member records are pre-loaded to match with the <b>anonymous member id</b> field from the Claims data to exhibit enrichment."),
      map:entry("format", "XML documents. Retreived from MySQL database where each record is converted to a document."),
      map:entry("url", "N/A"),
      map:entry("count", xdmp:estimate(fn:collection("members")))
    )))
  )
  return
    document { $a ! xdmp:to-json(.) }
};
