using System.Collections.Generic;

namespace WeatherAPI.Model
{
    public interface IWeatherAPI
    {
        string APIKey { get; set; }
        List<Alert> AlertList();
    }
}