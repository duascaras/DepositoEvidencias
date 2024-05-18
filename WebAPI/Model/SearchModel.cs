namespace WebAPI.Model
{
    public class SearchModel
    {
        public string[]? Keywords { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
