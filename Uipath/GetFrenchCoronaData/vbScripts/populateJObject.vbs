dim scriptOut = "";
JObject o = new JObject
{
    { "name1", "value1" },
    { "name2", "value2" }
};
1/0;
foreach (JProperty property in o.Properties())
{
    MsgBox(property.Name + " - " + property.Value);
    scriptOut = property.Name;
}
// name1 - value1
// name2 - value2

foreach (KeyValuePair<string, JToken> property in o)
{
    MsgBox(property.Key + " - " + property.Value);
}