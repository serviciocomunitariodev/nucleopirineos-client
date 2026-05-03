type PhraseItem = {
  quote: string
  author?: string
}

const phrases: PhraseItem[] = [
  {
    quote: '"La musica transforma realidades y construye comunidad."',
    author: 'Direccion del nucleo',
  },
  {
    quote: '"Cada ensayo es una oportunidad para crecer juntos."',
    author: 'Equipo docente',
  },
  {
    quote: '"Aqui el talento se cultiva con disciplina y pasion."',
    author: 'Comunidad Pirineos',
  },
]

export default function PhrasesSection() {
  return (
    <section className='w-full bg-superficies py-20 landing-section' id='frases'>
      <div className='mx-auto w-full max-w-[1500px] px-4 lg:px-5'>
        <div className='grid items-stretch gap-6 md:grid-cols-3'>
          {phrases.map((item) => (
            <article
              key={item.quote}
              className='flex min-h-[330px] flex-col items-center rounded-2xl bg-transparent px-6 text-center'
            >
              <div className='flex min-h-[230px] w-full items-start justify-center'>
                <p className='text-[40px] font-bold leading-tight text-ink'>{item.quote}</p>
              </div>
              <p className='mt-auto pt-6 text-[26px] font-medium text-[#555b66]'>
                {item.author ?? 'Autor por definir'}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
