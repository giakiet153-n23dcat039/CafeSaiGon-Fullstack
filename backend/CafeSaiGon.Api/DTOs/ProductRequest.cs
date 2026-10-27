using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CafeSaiGon.Api.DTOs;

public class ProductRequest
{
    [Required, StringLength(120)] public string Name { get; set; } = string.Empty;
    [Required, StringLength(60)] public string Category { get; set; } = string.Empty;
    [StringLength(12)] public string Emoji { get; set; } = "☕";
    [Required, StringLength(30)] public string Weight { get; set; } = string.Empty;
    [Range(1, 1_000_000_000)] public long Price { get; set; }
    [StringLength(80)] public string Roast { get; set; } = string.Empty;
    [StringLength(350)] public string Flavor { get; set; } = string.Empty;
    [JsonPropertyName("desc"), StringLength(1200)] public string Desc { get; set; } = string.Empty;
    [StringLength(220)] public string BestFor { get; set; } = string.Empty;
    [StringLength(90)] public string ImageName { get; set; } = "blend-sai-gon";
}
