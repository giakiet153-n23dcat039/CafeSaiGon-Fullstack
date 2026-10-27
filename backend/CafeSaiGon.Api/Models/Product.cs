using System.Text.Json.Serialization;

namespace CafeSaiGon.Api.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Emoji { get; set; } = "☕";
    public string Weight { get; set; } = string.Empty;
    public long Price { get; set; } // VND nguyên, tránh sai số khi dùng số thực.
    public string Roast { get; set; } = string.Empty;
    public string Flavor { get; set; } = string.Empty;
    [JsonPropertyName("desc")]
    public string Desc { get; set; } = string.Empty;
    public string BestFor { get; set; } = string.Empty;
    public string ImageName { get; set; } = "blend-sai-gon";
}
