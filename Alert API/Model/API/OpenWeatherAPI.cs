using System.Collections.Generic;
using WeatherAPI.Model;

namespace WeatherAPI.Model.API
{
    public class OpenWeatherAPI: IWeatherAPI
    {
        public string APIKey {get;set;} = "ac1faa56f9cdf7ab2c5d71daba48a3f8";

        public List<Alert> AlertList() {
            List<Alert> alerts = new List<Alert>();

            return alerts;
        }
    }
}