namespace WeatherAPI.Model
{
    public class Alert
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Comment { get; set; }
        public string UserId { get; set; }
        public long Radius { get; set; }
        public string Type { get; set; }

        
    }
}