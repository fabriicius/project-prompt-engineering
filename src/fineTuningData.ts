import duckdb from "duckdb"

type Sentiment = "positivo" | "negativo" | "neutro"

const reviews: { review: string; sentiment: Sentiment }[] = [
  { review: "Produto ótimo, chegou rápido!", sentiment: "positivo" },
  { review: "Superou minhas expectativas, recomendo demais.", sentiment: "positivo" },
  { review: "Chegou antes do prazo e bem embalado.", sentiment: "positivo" },
  { review: "Qualidade excelente pelo preço que paguei.", sentiment: "positivo" },
  { review: "Já é a terceira vez que compro, nunca decepciona.", sentiment: "positivo" },
  { review: "Funciona perfeitamente, muito satisfeito.", sentiment: "positivo" },
  { review: "Atendimento rápido e produto de acordo com o anunciado.", sentiment: "positivo" },
  { review: "Adorei o acabamento, parece bem mais caro do que é.", sentiment: "positivo" },
  { review: "Entrega expressa funcionou direitinho, produto impecável.", sentiment: "positivo" },
  { review: "Vale cada centavo, comprarei de novo com certeza.", sentiment: "positivo" },
  { review: "Embalagem caprichada e produto exatamente como na foto.", sentiment: "positivo" },
  { review: "Ótimo custo-benefício, indico para amigos e família.", sentiment: "positivo" },
  { review: "Uso todos os dias e continua funcionando muito bem.", sentiment: "positivo" },
  { review: "Suporte ao cliente resolveu minha dúvida rapidinho, adorei.", sentiment: "positivo" },
  { review: "Melhor compra que fiz esse ano, sem dúvidas.", sentiment: "positivo" },
  { review: "Design bonito e muito prático no dia a dia.", sentiment: "positivo" },
  { review: "Recebi certinho, tudo funcionando, super recomendo.", sentiment: "positivo" },
  { review: "Fácil de instalar e o resultado ficou ótimo.", sentiment: "positivo" },
  { review: "Preço justo e entrega rápida, fiquei muito contente.", sentiment: "positivo" },
  { review: "Já indiquei para colegas de trabalho, é excelente.", sentiment: "positivo" },
  { review: "Não gostei, veio quebrado.", sentiment: "negativo" },
  { review: "Péssima qualidade, quebrou em uma semana.", sentiment: "negativo" },
  { review: "Veio com a tela rachada.", sentiment: "negativo" },
  { review: "Produto completamente diferente do anunciado.", sentiment: "negativo" },
  { review: "Demorou quase um mês para chegar, um absurdo.", sentiment: "negativo" },
  { review: "Atendimento péssimo, ninguém resolveu meu problema.", sentiment: "negativo" },
  { review: "Parou de funcionar depois de dois dias de uso.", sentiment: "negativo" },
  { review: "Cheguei a devolver, não valia o preço cobrado.", sentiment: "negativo" },
  { review: "Embalagem toda amassada e produto danificado.", sentiment: "negativo" },
  { review: "Nunca mais compro nessa loja, experiência horrível.", sentiment: "negativo" },
  { review: "Faltou peça na caixa, tive que reclamar para reenviarem.", sentiment: "negativo" },
  { review: "Material barato, não parece nada com a descrição.", sentiment: "negativo" },
  { review: "Perdi dinheiro com esse produto, não funciona direito.", sentiment: "negativo" },
  { review: "Veio manchado e com cheiro forte de químico.", sentiment: "negativo" },
  { review: "Suporte técnico nunca respondeu meus e-mails.", sentiment: "negativo" },
  { review: "Muito ruim, não recomendo para ninguém.", sentiment: "negativo" },
  { review: "Trocaram o produto errado e ainda cobraram frete de novo.", sentiment: "negativo" },
  { review: "A bateria dura menos de uma hora, decepcionante.", sentiment: "negativo" },
  { review: "Chegou sujo e sem manual de instruções.", sentiment: "negativo" },
  { review: "Reclamei três vezes e não tive resposta nenhuma.", sentiment: "negativo" },
  { review: "Mais ou menos, esperava mais pelo preço.", sentiment: "neutro" },
  { review: "Produto ok, nada de especial.", sentiment: "neutro" },
  { review: "Cumpre o que promete, mas não impressiona.", sentiment: "neutro" },
  { review: "Entrega dentro do prazo, produto mediano.", sentiment: "neutro" },
  { review: "Funciona, mas o acabamento poderia ser melhor.", sentiment: "neutro" },
  { review: "Nada de excepcional, mas também não é ruim.", sentiment: "neutro" },
  { review: "Achei o preço um pouco alto para o que oferece.", sentiment: "neutro" },
  { review: "Serve para o básico, não é o que eu esperava.", sentiment: "neutro" },
  { review: "Embalagem simples, produto dentro do esperado.", sentiment: "neutro" },
  { review: "Não é ruim, mas também não me impressionou.", sentiment: "neutro" },
  { review: "Chegou certo, sem problemas, sem grandes destaques.", sentiment: "neutro" },
  { review: "Qualidade mediana, atende para uso ocasional.", sentiment: "neutro" },
  { review: "Achei o tamanho diferente do que imaginei, mas dá pro gasto.", sentiment: "neutro" },
  { review: "Fiquei em cima do muro, é razoável pelo valor pago.", sentiment: "neutro" },
  { review: "Funciona bem, mas o visual deixa a desejar.", sentiment: "neutro" },
  { review: "Não é o melhor nem o pior que já comprei.", sentiment: "neutro" },
  { review: "Entrega ok, produto dentro do que já esperava.", sentiment: "neutro" },
  { review: "Razoável, mas tem opções melhores no mercado.", sentiment: "neutro" },
  { review: "Deu pro gasto, mas não recompraria tão cedo.", sentiment: "neutro" },
  { review: "Produto comum, sem nada que se destaque.", sentiment: "neutro" },
];

const db = new duckdb.Database(":memory:")
const con = db.connect()

const values = reviews.map(
  ({ review, sentiment }) => `('${review.replace("'", "''")}', '${sentiment}')`
)

console.log("values", values)

con.run(`
  COPY (SELECT * FROM (VALUES ${values}) as t(review, sentiment))
  TO 'reviews.parquet' (FORMAT PARQUET);
`)
