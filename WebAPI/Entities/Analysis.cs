namespace WebAPI.Entities
{
    public class Analysis
    {
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; } //data criação
        public ExtendedIdentityUser AuthorizedUser { get; set; } //o funcionario que autorizou a saida do item
        public ExtendedIdentityUser WrittenUser { get; set; } //o funcionario que está lendo qrcode e fazendo a analise
        public Item Item { get; set; }
        public string? Laudo { get; set; }
        public string? AnalysisType { get; set; }
        public DateTime SentDate { get; set; } //data que o funcionario terminou a analyse e enviou
        public bool IsFinished { get; set; }
        public bool IsConfirmed { get; set; } //usuario confirmou que recebeu
        public ExtendedIdentityUser ConfirmedUser { get; set; } //usuario que confirmou que recebeu
        public DateTime ConfirmationDate { get; set; } //data que o usuario confirmou o recebimento
    }

}
