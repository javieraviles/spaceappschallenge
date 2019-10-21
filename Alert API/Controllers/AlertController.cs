using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WeatherAPI.Model;
using WeatherAPI.Model.API;

namespace WeatherAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AlertController : ControllerBase
    {
        public string ProjectName { get; set; } = "safety-network";

        [HttpGet("AllAlerts")]
        public async Task<IActionResult> GetAllAlerts()
        {
            IEnumerable<Alert> alerts = RetrieveAlerts();

            foreach (Alert alert in alerts)
            {
                await CreateNewAlert(alert, alert.Comment);
            }

            return Ok(alerts);
        }

        [HttpGet("GetAllAlerts")]
        public async Task<IActionResult> GetAlertsFromFirebase()
        {
            FirestoreDb db = FirestoreDb.Create(ProjectName);
            Query allAlertsQuery = db.Collection("alerts");
            QuerySnapshot allAlertsQuerySnapshot = await allAlertsQuery.GetSnapshotAsync();
            List<Alert> alerts = new List<Alert>();
            foreach (DocumentSnapshot documentSnapshot in allAlertsQuerySnapshot.Documents)
            {
                Alert alert = new Alert();
                Dictionary<string, object> city = documentSnapshot.ToDictionary();
                foreach (KeyValuePair<string, object> pair in city)
                {
                    switch (pair.Key)
                    {
                        case "coords":
                            foreach (KeyValuePair<string, object> coords in (pair.Value as Dictionary<string, object>))
                            {
                                if (coords.Key == "geopoint")
                                {
                                    alert.Latitude = ((GeoPoint)coords.Value).Latitude;
                                    alert.Longitude = ((GeoPoint)coords.Value).Longitude;
                                }
                            }
                            break;
                        case "radius":
                            alert.Radius = long.Parse(pair.Value.ToString());
                            break;
                        case "userId":
                            alert.UserId = pair.Value as string;
                            break;
                        case "type":
                            alert.Type = pair.Value as string;
                            break;
                        case "hazard":
                            alert.Comment = pair.Value as string;
                            break;
                        default:
                            break;
                    }

                }
                alerts.Add(alert);
            }

            return Ok(alerts);
        }


        [HttpPost("FireAlert")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Alert>> CreateFireAlert(Alert alert)
        {
            return await CreateNewAlert(alert, "Fuego!!!!");
        }

        [HttpPost("FloodAlert")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Alert>> CreateFloodAlert(Alert alert)
        {
            return await CreateNewAlert(alert, "Inundacion!!!!");
        }

        [HttpPost("CreateAlert")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Alert>> CreateNewAlert([FromBody]Alert alert, string message = "")
        {
            FirestoreDb db = FirestoreDb.Create(ProjectName);
            // [START fs_retrieve_create_examples]
            CollectionReference citiesRef = db.Collection("alerts");
            await citiesRef.Document("AEMET" + DateTime.Now.ToLongTimeString().Replace(":", "")).SetAsync(new Dictionary<string, object>()
            {
                { "hazard", alert.Comment },
                { "radius", alert.Radius },
                { "type", alert.Type },
                { "userId", alert.UserId },
                { "coords", new Dictionary<string, object>()
                    {
                        { "geopoint", new GeoPoint(alert.Latitude, alert.Longitude) }
                    }
                }

            });

            return Ok();
        }

        private IEnumerable<Alert> RetrieveAlerts()
        {
            List<IWeatherAPI> myApiWeather = new List<IWeatherAPI>(){
                new AccuweatherAPI(),
                new AEMETAPI(),
                new OpenWeatherAPI()
            };


            List<Alert> alerts = new List<Alert>();

            foreach (IWeatherAPI api in myApiWeather)
            {
                alerts.AddRange(api.AlertList());
            }

            return alerts;
        }


    }
}