namespace WebAPI.Entities
{
    public class Analysis
    {
        public int Id { get; set; }
        /// <summary>
        /// Data de crianção.
        /// </summary>
        public DateTime CreatedDate { get; set; } 
        /// <summary>
        /// O funcionário que autorizou a saída do item.
        /// </summary>
        public ExtendedIdentityUser AuthorizedUser { get; set; } = default!;
        /// <summary>
        /// O funcionário que está lendo QR Code e fazendo a análise.
        /// </summary>
        public ExtendedIdentityUser? WrittenUser { get; set; } 
        public Item Item { get; set; } = default!;
        public string? Laudo { get; set; }
        public string? AnalysisType { get; set; }
        /// <summary>
        /// Data que o funcionário terminou a análise e enviou.
        /// </summary>
        public DateTime? SentDate { get; set; } 
        public bool IsFinished { get; set; }
        /// <summary>
        /// Propriedade que confirma o recebimento.
        /// </summary>
        public bool IsConfirmed { get; set; }
        /// <summary>
        /// Usuário que confirmou o recebimento.
        /// </summary>
        public ExtendedIdentityUser? ConfirmedUser { get; set; }
        /// <summary>
        /// Data que o usuário confirmou o recebimento
        /// </summary>
        public DateTime ConfirmationDate { get; set; } 
    }

}
