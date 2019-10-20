using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Xml;

namespace WeatherAPI.Model.API
{
    public class AEMETAPI : IWeatherAPI
    {
        public string APIKey { get; set; } = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwYWNvLnJvbWVyby5lc3RlYmFuQGdtYWlsLmNvbSIsImp0aSI6Ijg4YTgxYjA1LTVkMjMtNGI4Zi1hNTllLTNhNWNiZTg5ZmI3NCIsImlzcyI6IkFFTUVUIiwiaWF0IjoxNTcxNDgxOTE1LCJ1c2VySWQiOiI4OGE4MWIwNS01ZDIzLTRiOGYtYTU5ZS0zYTVjYmU4OWZiNzQiLCJyb2xlIjoiIn0.LJZfmHLTQ70Vp3FG6yPjKxaSYacnHmqT_1Xo0mbAtko";

        public List<Alert> AlertList()
        {
            List<Alert> alerts = new List<Alert>();

            string tempDir = "C:/Temp/";
            string downloadedFile = tempDir + DateTime.Now.ToShortDateString().Replace("/", "-") + ".tar";

            RestClient client = new RestClient("https://opendata.aemet.es/opendata/api/avisos_cap/ultimoelaborado/area/73?api_key=" + APIKey);
            RestRequest request = new RestRequest(Method.GET);
            request.AddHeader("cache-control", "no-cache");
            IRestResponse response = client.Execute(request);

            dynamic data = JObject.Parse(response.Content);
            WebClient myWebClient = new WebClient();
            myWebClient.DownloadFile(data.datos.ToString(), downloadedFile);

            Utils.Tar.ExtractTar(downloadedFile, tempDir);

            File.Delete(downloadedFile);

            foreach (string file in Directory.GetFiles(tempDir))
            {
                Alert alert = BuildAlertFromXML(file);
                if (alert != null)
                {
                    alerts.Add(alert);
                }

                File.Delete(file);
            }



            return alerts;
        }

        private Alert BuildAlertFromXML(string filename)
        {
            Alert alert = new Alert
            {
                Radius = 100,
                Latitude = 38.004668,
                Longitude = -1.144907,
                Type = "AREA",
                UserId = "666"
            };

            using (XmlReader reader = XmlReader.Create(filename))
            {
                while (reader.Read())
                {
                    //return only when you have START tag  

                    if (reader.Name.ToString() == "event" && string.IsNullOrEmpty(alert.Comment))
                    {
                        alert.Comment = reader.ReadString();
                    }
                }
            }
            return alert;
        }


    }
}