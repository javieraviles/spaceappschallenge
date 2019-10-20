using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        public IActionResult GetAllAlerts()
        {
            IEnumerable<Alert> alerts = RetrieveAlerts();

            foreach (Alert alert in alerts)
            {
                //CreateNewAlert(alert, alert.Comment);
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
        public ActionResult<Alert> CreateFireAlert(Alert alert)
        {
            return CreateNewAlert(alert, "Fuego!!!!");
        }

        [HttpPost("FloodAlert")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Alert> CreateFloodAlert(Alert alert)
        {
            return CreateNewAlert(alert, "Inundacion!!!!");
        }

        [HttpPost("CreateAlert")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Alert> CreateNewAlert([FromBody]Alert alert, string message = "")
        {
            FirestoreDb db = FirestoreDb.Create(ProjectName);
            DocumentReference cityRef = db.Collection("alerts").Document("SF");
            // [START fs_add_subcollection]
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