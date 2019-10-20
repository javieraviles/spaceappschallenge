using System.Collections.Generic;

namespace WeatherAPI.Model.API
{
    public class AccuweatherAPI : IWeatherAPI
    {
        public string APIKey {get;set;} = "AxzwLKgT6KFUrsy5qzBbG47Sq38gUkxm";

        public List<Alert> AlertList() {
            List<Alert> alerts = new List<Alert>();

            return alerts;
        }
    }
}