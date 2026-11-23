// As 20 cartas da caixa, pela ordem em que se leem. A carta 1 abre a dinâmica (a caixa ainda fechada); a carta k+1 é a
// da k-ésima virtude (VIRTUDES[k-1]). Na TV aparece a `frase` curta e o «→ passa a quem achas mais <seguinte>»; o
// `texto` completo fica só na janela do apresentador, para ler em voz alta.

export type Carta = {
  /** A frase curta que aparece na TV. */
  frase: string;
  /** Quem se procura a seguir (a palavra em maiúsculas da carta). Vazio na última. */
  seguinte: string;
  /** O texto completo, para ler. */
  texto: string;
};

export const CARTAS: Carta[] = [
  {
    frase: 'Esta caixa simboliza a compreensão, a confraternização e a amizade.',
    seguinte: 'ORGANIZADO',
    texto: 'PARABÉNS! Tens muita sorte, foste premiado com esta caixa. Ela simboliza a compreensão, a confraternização e a amizade durante este tempo. Mas ela não será tua: observa os amigos, e aquele que considerares mais ORGANIZADO será o ganhador dela.',
  },
  {
    frase: 'A organização é algo de grande valor.',
    seguinte: 'ALEGRE ou FELIZ',
    texto: 'A ORGANIZAÇÃO é algo de grande valor e tu, como possuidor dessa virtude, vais levantar-te para entregar esta caixa ao amigo que achares mais ALEGRE ou FELIZ.',
  },
  {
    frase: 'A tua alegria anima os nossos encontros.',
    seguinte: 'SÉRIO',
    texto: 'ALEGRIA — aqui está uma caixa que te entrego por ver em ti muita alegria, alegria esta que anima os nossos encontros, tornando-os sempre agradáveis. Mas infelizmente ela não é tua: com muita alegria, entrega-a à pessoa mais SÉRIA da turma.',
  },
  {
    frase: 'A seriedade faz de ti uma pessoa respeitada.',
    seguinte: 'ELEGANTE',
    texto: 'A SERIEDADE é a tua marca pessoal. Ser sério faz de ti uma pessoa respeitada, porém, ao contrário das pessoas sérias, és agradável e suportável — continua assim. Portanto a caixa não é tua: com toda a seriedade, passa-a à pessoa mais ELEGANTE.',
  },
  {
    frase: 'A elegância traz-te muitos amigos.',
    seguinte: 'MEIGO',
    texto: 'ELEGÂNCIA — deves esforçar-te para manter todo este visual elegante, e o bom é que consegues: através dela conquistas muitos amigos, menos esta caixa. Por isso passa-a à pessoa mais MEIGA da turma.',
  },
  {
    frase: 'A meiguice é algo muito raro, e tu tens.',
    seguinte: 'EXTROVERTIDO',
    texto: 'A MEIGUICE é algo muito raro e tu tens. Parabéns! Mas a caixa ainda não será tua, e tu, com o teu jeito tão especial de ser, vais fazer questão de entregá-la a quem consideras mais EXTROVERTIDO.',
  },
  {
    frase: 'Chegas e já fazes a festa.',
    seguinte: 'que te transmite FELICIDADE',
    texto: 'És EXTROVERTIDO: chegas e já vais fazendo a festa, não importa o momento nem o lugar; falas e brincas com toda a gente, e com uma facilidade espetacular instalas-te no meio de todos. Parabéns, deves ser muito feliz — e cabe-te encontrar no meio de nós alguém que te transmita FELICIDADE.',
  },
  {
    frase: 'A felicidade é como uma borboleta.',
    seguinte: 'CORAJOSO',
    texto: 'Dizem que a FELICIDADE é como uma borboleta: quanto mais a persegues, mais ela foge. Mas se voltas a tua atenção para outras coisas, ela vem e pousa suavemente no teu ombro. Não chego a ver a borboleta no teu ombro, mas vejo a felicidade estampada no teu rosto, e isso faz-nos felizes. Com toda a felicidade que existe em ti, passa a caixa à pessoa mais CORAJOSA.',
  },
  {
    frase: 'A coragem é a virtude pela qual foste escolhido.',
    seguinte: 'INTELIGENTE',
    texto: 'Foste contemplado com esta caixa e agora, demonstrando a virtude da CORAGEM pela qual foste escolhido, passa-a à pessoa mais INTELIGENTE.',
  },
  {
    frase: 'Encontraste espaço para mostrar o teu talento.',
    seguinte: 'SIMPÁTICO',
    texto: 'A INTELIGÊNCIA foi-nos dada por Deus. Parabéns por teres encontrado espaço para demonstrar esse talento, pois muitos são inteligentes, mas a sociedade impede-os de desenvolver essa virtude. Demonstra mais um ato da tua inteligência passando este presente a quem achares mais SIMPÁTICO.',
  },
  {
    frase: 'O mundo precisa de pessoas simpáticas como tu.',
    seguinte: 'AMIGO',
    texto: 'Para comemorar a escolha do presente, distribui um largo sorriso pelos amigos. O mundo está tão amargo e, para melhorar um pouco, precisamos de pessoas SIMPÁTICAS como tu. Parabéns pela simpatia! Não fiques triste: o presente não será teu, passa-o a quem achas mais AMIGO.',
  },
  {
    frase: 'Um verdadeiro amigo é um tesouro.',
    seguinte: 'PONTUAL',
    texto: 'A AMIZADE é uma das coisas mais importantes na vida. Ter um verdadeiro amigo é como possuir um tesouro de valor exorbitante — por isso, conquista outro amigo dando-lhe esta caixa. Para isso, ele tem de ser PONTUAL nos compromissos.',
  },
  {
    frase: 'Não gostas de deixar ninguém à espera.',
    seguinte: 'SOLIDÁRIO',
    texto: 'A PONTUALIDADE é a qualidade marcante dos britânicos, e tu, brasileiro ou português, sabes respeitar os teus compromissos honrando o horário. Com certeza não gostas de deixar ninguém à espera. Mas aguarda a hora certa de ganhar uma caixa, porque esta ainda não é tua: passa-a à pessoa mais SOLIDÁRIA.',
  },
  {
    frase: 'A solidariedade é coisa rara.',
    seguinte: 'BONITO',
    texto: 'A SOLIDARIEDADE é coisa rara no mundo em que vivemos, onde encontramos tantas pessoas egocêntricas. Estás de parabéns por seres solidário com os colegas, mas o presente ainda não será teu: passa-o à pessoa mais BONITA.',
  },
  {
    frase: 'Desfila para todos verem!',
    seguinte: 'que te transmite PAZ',
    texto: 'Que bom! Foste escolhido como o colega mais BONITO do grupo, por isso desfila para todos observarem o quanto és bonito. Obrigado pelo desfile, mas o presente não será teu: passa-o a quem te transmite PAZ.',
  },
  {
    frase: 'Transmites gratuitamente uma grande riqueza: a paz.',
    seguinte: 'DINÂMICO',
    texto: 'O mundo inteiro clama por PAZ, e tu, gratuitamente, transmites esta tão grande riqueza. Parabéns! Fazes falta às grandes potências do mundo, responsáveis por tantos conflitos. Com muita paz, passa esta caixa à pessoa mais DINÂMICA.',
  },
  {
    frase: 'Tornas tudo simples e eficiente.',
    seguinte: 'TRABALHADOR',
    texto: 'Sabes mesmo como fazer as coisas: nada é difícil, procuras sempre dar um jeito de tornar tudo muito simples e eficiente — não é à toa que és DINÂMICO. Portanto, com eficiência, escolhe entre todos a pessoa mais TRABALHADORA, que mereça a caixa.',
  },
  {
    frase: 'Fazes do trabalho até motivo de festa.',
    seguinte: 'RESPONSÁVEL',
    texto: 'Dizem que o TRABALHO dignifica o homem, e tu levas o trabalho a sério: não perdes tempo e contigo não há moleza — fazes do trabalho até motivo de festa. Gostando de trabalhar assim, és capaz de encontrar entre os demais alguém RESPONSÁVEL para lhe dar esta caixa.',
  },
  {
    frase: 'Nunca desapontas ninguém nos compromissos.',
    seguinte: 'CARIDOSO',
    texto: 'A RESPONSABILIDADE é contigo: nunca desapontas ninguém nos compromissos e cumpres sempre o que prometes. Sendo o mais responsável, recebes o encargo de maior responsabilidade: cabe-te encerrar este passa-repassa, dando esta caixa à pessoa mais CARIDOSA da turma.',
  },
  {
    frase: 'Quem é caridoso divide o que tem.',
    seguinte: '',
    texto: 'Bem… a pessoa CARIDOSA não é egoísta, não tem inveja, gosta de toda a gente e tem como satisfação ajudar o próximo, servir e dividir o que tem — principalmente quando se trata de uma caixa misteriosa. Por isso abre-a e divide com todos os presentes.',
  },
];
